import type { LambdaFunctionUrlEvent } from '../types/schema.js';
import { APIGatewayProxyEventV2Schema } from './api-gatewayv2.js';

/**
 * Zod schema for Lambda Function URL follows the API Gateway HTTP APIs Payload Format Version 2.0.
 *
 * Keys related to API Gateway features not available in Function URL use a sentinel value (e.g.`routeKey`, `stage`).
 *
 * @example
 * ```json
 * {
 *  "version": "2.0",
 *  "routeKey": "$default",
 *  "rawPath": "/",
 *  "rawQueryString": "",
 *  "headers": {
 *    "sec-fetch-mode": "navigate",
 *    "x-amzn-tls-version": "TLSv1.2",
 *    "sec-fetch-site": "cross-site",
 *    "accept-language": "pt-BR,pt;q=0.9",
 *    "x-forwarded-proto": "https",
 *    "x-forwarded-port": "443",
 *    "x-forwarded-for": "123.123.123.123",
 *    "sec-fetch-user": "?1",
 *    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng;q=0.8,application/signed-exchange;v=b3;q=0.9",
 *    "x-amzn-tls-cipher-suite": "ECDHE-RSA-AES128-GCM-SHA256",
 *    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
 *    "sec-ch-ua-mobile": "?0",
 *    "x-amzn-trace-id": "Root=1-62ecd163-5f302e550dcde3b12402207d",
 *    "sec-ch-ua-platform": "\"Linux\"",
 *    "host": "<url-id>.lambda-url.us-east-1.on.aws",
 *    "upgrade-insecure-requests": "1",
 *    "cache-control": "max-age=0",
 *    "accept-encoding": "gzip, deflate, br",
 *    "sec-fetch-dest": "document",
 *    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
 *  },
 *  "requestContext": {
 *    "accountId": "anonymous",
 *    "apiId": "<url-id>",
 *    "domainName": "<url-id>.lambda-url.us-east-1.on.aws",
 *    "domainPrefix": "<url-id>",
 *    "http": {
 *      "method": "GET",
 *      "path": "/",
 *      "protocol": "HTTP/1.1",
 *      "sourceIp": "123.123.123.123",
 *      "userAgent": "agent"
 *    },
 *    "requestId": "id",
 *    "routeKey": "$default",
 *    "stage": "$default",
 *    "time": "05/Aug/2022:08:14:39 +0000",
 *    "timeEpoch": 1659687279885
 *  },
 *  "isBase64Encoded": false
 * }
 * ```
 *
 * @see {@link LambdaFunctionUrlEvent | `LambdaFunctionUrlEvent`}
 * @see {@link https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html#urls-payloads}
 */
const LambdaFunctionUrlSchema = APIGatewayProxyEventV2Schema.extend({});

export { LambdaFunctionUrlSchema };
