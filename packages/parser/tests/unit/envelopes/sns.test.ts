import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { SnsEnvelope } from '../../../src/envelopes/sns.js';
import { JSONStringified } from '../../../src/helpers/index.js';
import type { SnsEvent } from '../../../src/types/schema.js';
import { getTestEvent } from '../helpers/utils.js';

describe('Envelope: SnsEnvelope', () => {
  const baseEvent = getTestEvent<SnsEvent>({
    eventsPath: 'sns',
    filename: 'base',
  });

  describe('Method: parse', () => {
    it('throws if one of the payloads does not match the schema', () => {
      // Prepare
      const event = structuredClone(baseEvent);

      // Act & Assess
      expect(() =>
        SnsEnvelope.parse(
          event,
          z
            .object({
              Message: z.string(),
            })
            .strict()
        )
      ).toThrow(
        expect.objectContaining({
          name: 'ParseError',
          message: expect.stringContaining(
            'Failed to parse SNS record at index 0'
          ),
          cause: expect.objectContaining({
            issues: [
              {
                code: 'invalid_type',
                expected: 'object',
                path: ['Records', 0, 'Sns', 'Message'],
                message: 'Invalid input: expected object, received string',
              },
            ],
          }),
        })
      );
    });

    it('parses a SNS event', () => {
      // Prepare
      const testEvent = structuredClone(baseEvent);

      // Act
      const result = SnsEnvelope.parse(testEvent, z.string());

      // Assess
      expect(result).toStrictEqual(['Hello from SNS!']);
    });
  });

  describe('Method: safeParse', () => {
    it('parses a SNS event', () => {
      // Prepare
      const testEvent = structuredClone(baseEvent);

      // Act
      const result = SnsEnvelope.safeParse(testEvent, z.string());

      // Assess
      expect(result).toStrictEqual({
        success: true,
        data: ['Hello from SNS!'],
      });
    });

    it('returns an error if the event is not a valid SNS event', () => {
      // Prepare
      const event = structuredClone(baseEvent);
      // @ts-expect-error - force invalid event
      event.Records[0].Sns = undefined;

      // Act
      const result = SnsEnvelope.safeParse(event, z.string());

      // Assess
      expect(result).toEqual({
        success: false,
        error: expect.objectContaining({
          name: 'ParseError',
          message: expect.stringContaining('Failed to parse SNS envelope'),
          cause: expect.objectContaining({
            issues: [
              {
                code: 'invalid_type',
                expected: 'object',
                path: ['Records', 0, 'Sns'],
                message: 'Invalid input: expected object, received undefined',
              },
            ],
          }),
        }),
        originalEvent: event,
      });
    });

    it('returns an error if any of the messages do not match the schema', () => {
      // Prepare
      const event = structuredClone(baseEvent);
      event.Records[1] = structuredClone(event.Records[0]);
      event.Records[0].Sns.Message = JSON.stringify({ foo: 'bar' });
      event.Records[1].Sns.Message = JSON.stringify({ foo: 36 });

      // Act
      const result = SnsEnvelope.safeParse(
        event,
        JSONStringified(
          z.object({
            foo: z.string(),
          })
        )
      );

      // Assess
      expect(result).toEqual({
        success: false,
        error: expect.objectContaining({
          name: 'ParseError',
          message: expect.stringContaining(
            'Failed to parse SNS message at index 1'
          ),
          cause: expect.objectContaining({
            issues: [
              {
                code: 'invalid_type',
                expected: 'string',
                path: ['Records', 1, 'Sns', 'Message', 'foo'],
                message: 'Invalid input: expected string, received number',
              },
            ],
          }),
        }),
        originalEvent: event,
      });
    });

    it('returns a combined error if multiple records fail to parse', () => {
      // Prepare
      const event = structuredClone(baseEvent);
      event.Records[1] = structuredClone(event.Records[0]);

      // Act
      const result = SnsEnvelope.safeParse(
        event,
        JSONStringified(
          z.object({
            foo: z.string(),
          })
        )
      );

      // Assess
      expect(result).toEqual({
        success: false,
        error: expect.objectContaining({
          name: 'ParseError',
          message: expect.stringContaining(
            'Failed to parse SNS messages at indexes 0, 1'
          ),
          cause: expect.objectContaining({
            issues: [
              {
                code: 'custom',
                message: expect.stringMatching(/^Invalid JSON - /),
                fatal: true,
                path: ['Records', 0, 'Sns', 'Message'],
              },
              {
                code: 'custom',
                message: expect.stringMatching(/^Invalid JSON - /),
                fatal: true,
                path: ['Records', 1, 'Sns', 'Message'],
              },
            ],
          }),
        }),
        originalEvent: event,
      });
    });
  });
});
