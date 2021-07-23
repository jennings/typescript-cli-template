import { cosmiconfig } from "cosmiconfig";
import packageJson from "../package.json";
import { Once } from "./utilities";

const fetchConfig = new Once();

export interface Config {
  username: string;
  password: string;
}

export async function readSettings() {
  const explorer = await cosmiconfig(packageJson.name);
  const result = await explorer.search();
  return result?.config ?? null;
}
