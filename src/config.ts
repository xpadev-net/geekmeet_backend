import "dotenv/config";

export const ExpressPort = Number(process.env.FASTIFY_PORT) || 9000;
export const ExpressCorsHost = process.env.FASTIFY_CORS_HOST ?? "*";
