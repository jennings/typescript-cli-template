import { Command } from "commander";
import { createGreetingCommand } from "./greeting";
import { createStoreCommand } from "./store";

export function createCommands(program: Command) {
  createGreetingCommand(program);
  createStoreCommand(program);
}
