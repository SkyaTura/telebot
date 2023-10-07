import mongoose from 'mongoose'

import { UserSchema } from './User'
import { ChatSchema } from './Chat'

export type { IUser } from './User'

const connect = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test')

  return {
    connection,
    Chat: connection.model('Chat', ChatSchema),
    User: connection.model('User', UserSchema),
  }
}

export type DB = Awaited<ReturnType<typeof connect>>

declare global {
  interface AppSetupContext {
    db: DB
  }
}

export default defineSetup(async ({ injectSetup }) => injectSetup('db', await connect()))
