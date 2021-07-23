import * as path from "path";
import * as process from "process";
import * as os from "os";
import * as fs from "fs/promises";
import packageJson from "../package.json";

interface Paths {
  data: string;
}

function getUnixPaths(appName: string): Paths {
  const dataHome =
    process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share");

  return {
    data: path.join(dataHome, appName),
  };
}

function getWindowsPaths(appName: string): Paths {
  const appData =
    process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming");

  return {
    data: path.join(appData, appName),
  };
}

const PATHS =
  os.platform() === "win32"
    ? getWindowsPaths(packageJson.name)
    : getUnixPaths(packageJson.name);

async function getFileNameAndEnsurePathExists(
  key: keyof Paths,
  fileName: string
) {
  const fullPath = path.join(PATHS[key], fileName);
  const dirname = path.dirname(fullPath);
  await fs.mkdir(dirname, { recursive: true });
  return fullPath;
}

export async function readData(
  key: keyof Paths,
  fileName: string
): Promise<unknown> {
  const filePath = await getFileNameAndEnsurePathExists(key, fileName);
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  return JSON.parse(data);
}

export async function writeData(
  key: keyof Paths,
  fileName: string,
  data: unknown
) {
  const filePath = await getFileNameAndEnsurePathExists(key, fileName);
  const serialized = JSON.stringify(data, undefined, 2);
  await fs.writeFile(filePath, serialized, { encoding: "utf-8" });
}
