import chalk from 'chalk'
import { EMOJIS } from './emojis'

type ChalkOptions = {
  msg: { text: string; color: string }
  prefix?: { text: string; color: string }
  suffix?: { text: string; color: string }
}

export const Message = {
  Runner_execution_error: (command: string) =>
    `\nFailed to execute command: ${chalk.yellow(command)}`,
  Create_config_success: (path: string) =>
    console.log(
      `${EMOJIS.SUCCESS} ${chalk.green(
        'Success create local config files! path is'
      )} ${chalk.yellow(path)}`
    ),
  Package_manager_installation_in_progress: `Installation in progress... ${EMOJIS.COFFEE}`,
  Package_manager_installation_failed: (commandToRunManually: string) =>
    `${
      EMOJIS.SCREAM
    }  Packages installation failed!\nIn case you don't see any errors above, consider manually running the failed command ${chalk.gray(
      chalk.bold(commandToRunManually)
    )} to see more details on why it errored out.`,

  // 状态设置
  sucess: (msg: string): void =>
    console.log(EMOJIS.SUCCESS + ' ' + chalk.green(msg)),
  fail: (msg: string): void =>
    console.log(EMOJIS.ERROR + ' ' + chalk.red(msg)),
  warn: (msg: string): void =>
    console.log(
      EMOJIS.WARN + ' ' + chalk.yellow(msg)
    ),
    
  // 动态设置
  chalk: (options: ChalkOptions): void => {
    const prefixTxt = options.prefix
      ? chalk[options.prefix.color](options.prefix.text) + ' '
      : ''
    const suffixTxt = options.suffix
      ? ' ' + chalk[options.suffix.color](options.suffix.text)
      : ''
    const txt = options.msg ? chalk[options.msg.color](options.msg.text) : ''
    console.log(prefixTxt + txt + suffixTxt)
  },
  detail: (title: string, msg: string): void =>
    console.log(
      EMOJIS.COMPASS +
        ` ${chalk.yellow(title)} ` +
        chalk.underline(chalk.gray(msg))
    )
}
