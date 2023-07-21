import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySocket from "fastify-socket.io";
import fastifyCookie from "@fastify/cookie";
import fastifySession from "@mgcrea/fastify-session";
import {
  FastifyCookieSecret,
  FastifyCorsHost,
  FastifySessionTTL,
} from "@/config";
import { registerEndpointHandler } from "@/endpoints";
import { setupSocketIO } from "@/socketio";

export const setupFastify = async (port: number) => {
  const app = fastify();
  await app.register(fastifyCors, {
    origin: FastifyCorsHost,
  });
  await app.register(fastifySocket, {});
  await app.register(fastifyCookie, {});
  await app.register(fastifySession, {
    secret: FastifyCookieSecret,
    cookie: { maxAge: FastifySessionTTL },
  });
  registerEndpointHandler(app);
  await app.listen({ port });
  app.ready((err) => {
    if (err) throw err;
    setupSocketIO(app);
  });
};
