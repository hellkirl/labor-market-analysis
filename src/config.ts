import * as dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const config = {
  hhUrl: "https://api.hh.ru",
  superjobBaseUrl: "https://api.superjob.ru/2.0",
  dayInMilliseconds: 86400000,
  superjobToken: process.env.SUPERJOB ?? "",
};
