import { Telegraf } from "telegraf"

export default defineSetup(async ({ injectSetup, loadModules }) => {
  if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN is required!')
  const bot = new Telegraf<AppContext>(process.env.BOT_TOKEN)
  injectSetup('bot', bot)
  injectSetup('injectCtx', (key, value) => bot.use((ctx, next) => {
    if (key in ctx) throw new Error(`Key ${key} already exists!`)
    ctx[key] = value
    return next()
  }))
  injectSetup('injectCtxLazy', (key, getter) => bot.use(async (ctx, next) => {
    if (key in ctx) throw new Error(`Key ${key} already exists!`)
    ctx[key] = await getter(ctx)
    return next()
  }))
  await loadModules([
    import('./chat-config.module'),
    import('./guards.module'),
    import('./hello.module'),
    import('./welcome.module'),
  ])
  bot.launch()
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
})

declare global {
  interface AppSetupContext {
    bot: AppBot
    injectCtx: <K extends keyof AppContext>(key: K, value: AppContext[K]) => void
    injectCtxLazy: <K extends keyof AppContext>(key: K, getter: (ctx: AppContext) => Promise<AppContext[K]> | AppContext[K]) => void
  }
}
