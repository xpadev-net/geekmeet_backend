import "dotenv/config";

export const ExpressPort = Number(process.env.ExpressPort) || 9000;
export const ExpressCorsHost = process.env.ExpressCorsHost ?? "*";
