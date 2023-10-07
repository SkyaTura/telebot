export default async (modules: (AppSetupInternal | Promise<{ default: AppSetupInternal }>)[]) => {
  const setupCtx = {
    injectSetup: (key, value) => {
      if (key in setupCtx) throw new Error(`Key ${key} already exists!`)
      setupCtx[key] = value
    },
    loadModules: async (modules) => {
      for await (const item of modules) {
        const setup = typeof item === 'function' ? item : item.default
        await setup(setupCtx)
      }
    }
  } as AppSetupContext

  await setupCtx.loadModules(modules)

  return setupCtx
}

declare global {
  interface AppSetupContext {
    injectSetup: <K extends keyof AppSetupContext>(key: K, value: AppSetupContext[K]) => void
    loadModules: (modules: (AppSetupInternal | Promise<{ default: AppSetupInternal }>)[]) => Promise<void>
  }
}
