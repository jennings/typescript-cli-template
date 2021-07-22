import { Command } from "commander";
import { createGreetingCommand } from "./greeting";

export function createCommands(program: Command) {
  createGreetingCommand(program);
}
