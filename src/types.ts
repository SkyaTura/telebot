import type { Context, Telegraf } from 'telegraf'

declare global {
  interface AppContext extends Context { }
  type AppBot = Telegraf<AppContext>
  interface AppSetupContext { }
  type AppSetup = (setupCtx: AppSetupContext) => void | Promise<void>
  type AppSetupInternal = (setupCtx: AppSetupContext) => Promise<void>
  function defineSetup(setup: AppSetup): AppSetupInternal
}

global.defineSetup = function defineSetup(setup) {
  return (setupCtx) => Promise.resolve(setup(setupCtx))
}
