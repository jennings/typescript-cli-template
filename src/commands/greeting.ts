import { Command } from "commander";
import inquirer from "inquirer";

export function createGreetingCommand(program: Command) {
  program
    .command("greeting [message]")
    .description("say a greeting")
    .action(async (message: string | null) => {
      if (message == null) {
        const responses = await inquirer.prompt([
          {
            type: "text",
            name: "message",
            message: "What do you want to say?",
          },
        ]);
        message = responses.message;
      }
      console.log(message);
    });
}
