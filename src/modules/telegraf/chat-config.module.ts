import { IChat } from "../db/Chat"

export default defineSetup(async ({ db, injectCtxLazy }) => {
  injectCtxLazy('chatConfig', (ctx) =>
    !ctx.chat?.id ? null :
      db.Chat.findOneAndUpdate(
        { chatId: ctx.chat.id },
        {
          $set: { lastEventAt: new Date() },
          $inc: { eventCount: 1 },
          $setOnInsert: {
            chatId: ctx.chat.id,
            chatType: ctx.chat.type,
          }
        },
        { upsert: true, new: true }
      )
  )
})

declare global {
  interface AppContext {
    chatConfig: IChat | null
  }
}
