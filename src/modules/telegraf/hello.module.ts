export default defineSetup(({ bot, userGuard }) => {
  bot.command('hello', (ctx) => ctx.reply('Hello!'))
  bot.command('world', userGuard({ isRoot: true }, 'Você não pode fazer isso'), (ctx) => ctx.reply('World!'))
})
