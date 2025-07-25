import type { ZodType } from 'zod';
import { ParseError } from '../errors.js';
import { APIGatewayProxyEventSchema } from '../schemas/api-gateway.js';
import type { ParsedResult } from '../types/parser.js';
import { envelopeDiscriminator } from './envelope.js';

/**
 * API Gateway envelope to extract data within body key
 */
export const ApiGatewayEnvelope = {
  /**
   * This is a discriminator to differentiate whether an envelope returns an array or an object
   * @hidden
   */
  [envelopeDiscriminator]: 'object' as const,
  parse<T>(data: unknown, schema: ZodType<T>): T {
    try {
      return APIGatewayProxyEventSchema.extend({
        body: schema,
      }).parse(data).body;
    } catch (error) {
      throw new ParseError('Failed to parse API Gateway body', {
        cause: error as Error,
      });
    }
  },

  safeParse<T>(data: unknown, schema: ZodType<T>): ParsedResult<unknown, T> {
    const result = APIGatewayProxyEventSchema.extend({
      body: schema,
    }).safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: new ParseError('Failed to parse API Gateway body', {
          cause: result.error,
        }),
        originalEvent: data,
      };
    }

    return {
      success: true,
      data: result.data.body,
    };
  },
};
