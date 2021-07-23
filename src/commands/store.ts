import { Command, OptionValues } from "commander";
import inquirer from "inquirer";
import { readData, writeData } from "../data";
import chalk from "chalk";

export function createStoreCommand(program: Command) {
  program
    .command("store:set [key] [value]")
    .description("write a value")
    .action(
      async (
        key: string,
        value: string,
        options: OptionValues,
        command: Command
      ) => {
        const data = await getDataOrDefault();
        data[key] = value;
        await writeDataToFile(data);
        console.log(`Set key ${chalk.red(key)} to value: ${chalk.blue(value)}`);
      }
    );

  program
    .command("store:get [key]")
    .description("read a value")
    .action(async (key: string) => {
      const data = await getDataOrDefault();
      if (!(key in data)) {
        console.log(`Key ${chalk.red(key)} is not defined`);
        return;
      }

      const value = data[key];
      console.log(`${chalk.red(key)}=${chalk.blue(value)}`);
    });

  const fileName = "store.json";

  async function getDataOrDefault(): Promise<Record<string, unknown>> {
    try {
      return (await readData("data", fileName)) as any;
    } catch (err) {
      return {};
    }
  }

  async function writeDataToFile(data: unknown) {
    await writeData("data", fileName, data);
  }
}
