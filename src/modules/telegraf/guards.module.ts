import { Middleware } from "telegraf"

type GuardOptions = {
  isUser?: boolean
  isBot?: boolean
  isPremium?: boolean
  isRoot?: boolean
  isAdmin?: boolean
}

export default defineSetup(async ({ injectCtxLazy, injectSetup }) => {
  injectCtxLazy('userGuard', ctx => async (options) => {
    const user = ctx.message?.from
    if (typeof options.isUser === 'boolean' && Boolean(user) !== options.isUser) return false
    if (typeof options.isBot === 'boolean' && Boolean(user?.is_bot) !== options.isBot) return false
    if (typeof options.isPremium === 'boolean' && Boolean(user?.is_premium) !== options.isPremium) return false
    const userId = user?.id?.toString()
    const isRoot = Boolean(userId && process.env.ROOT_ID === userId)
    if (typeof options.isRoot === 'boolean' && isRoot !== options.isRoot) return false
    const isAdmin = isRoot || Boolean(userId && ctx.chatConfig?.admins.includes(userId))
    if (typeof options.isAdmin === 'boolean' && isAdmin !== options.isAdmin) return false

    return true
  })
  injectSetup('userGuard', (options, denyReply) => async (ctx, next) => {
    if (await ctx.userGuard(options)) return next()
    if (denyReply === false) return
    await ctx.reply(denyReply || 'Access denied!')
  })
})

declare global {
  interface AppContext {
    userGuard: (options: GuardOptions) => Promise<boolean>
  }
  interface AppSetupContext {
    userGuard: (options: GuardOptions, denyReply?: string | false) => Middleware<AppContext>
  }
}
