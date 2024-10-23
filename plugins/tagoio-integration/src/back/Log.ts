import chalk from "chalk";

const red = chalk.redBright;

function logError(message: string) {
  console.log(red("[ERROR]"), message);
}

export { logError };
