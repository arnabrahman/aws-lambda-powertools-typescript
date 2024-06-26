import {
  getRuntimeKey,
  type TestStack,
} from '@aws-lambda-powertools/testing-utils';
import type {
  ExtraTestProps,
  TestNodejsFunctionProps,
} from '@aws-lambda-powertools/testing-utils/types';
import { TestNodejsFunction } from '@aws-lambda-powertools/testing-utils/resources/lambda';
import { commonEnvironmentVars } from '../e2e/constants.js';

class TracerTestNodejsFunction extends TestNodejsFunction {
  public constructor(
    scope: TestStack,
    props: TestNodejsFunctionProps,
    extraProps: ExtraTestProps
  ) {
    const isEsm = extraProps.outputFormat === 'ESM';
    const isNodejs16x = getRuntimeKey() === 'nodejs16x';

    super(
      scope,
      {
        ...props,
        environment: {
          ...commonEnvironmentVars,
          EXPECTED_SERVICE_NAME: extraProps.nameSuffix,
          EXPECTED_CUSTOM_METADATA_VALUE: JSON.stringify(
            commonEnvironmentVars.EXPECTED_CUSTOM_METADATA_VALUE
          ),
          EXPECTED_CUSTOM_RESPONSE_VALUE: JSON.stringify(
            commonEnvironmentVars.EXPECTED_CUSTOM_RESPONSE_VALUE
          ),
          ...props.environment,
        },
        /**
         * For Node.js 16.x, we need to set `externalModules` to an empty array
         * so that the `aws-sdk` is bundled with the function.
         *
         * @see https://github.com/aws/aws-sdk-js-v3/issues/3230#issuecomment-1561973247
         */
        bundling: {
          ...(isEsm &&
            isNodejs16x && {
              externalModules: [],
            }),
        },
      },
      extraProps
    );
  }
}

export { TracerTestNodejsFunction };
