import "dotenv/config";

export const FastifyPort = Number(process.env.FASTIFY_PORT) || 9000;
export const FastifySessionTTL =
  Number(process.env.FASTIFY_SESSION_TTL) || 86400;
export const FastifyCorsHost = process.env.FASTIFY_CORS_HOST ?? "*";
export const FastifyCookieSecret = process.env.FASTIFY_COOKIE_SECRET ?? "";
