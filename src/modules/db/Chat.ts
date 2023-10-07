import { InferSchemaType, Schema, Mongoose } from "mongoose"

export const ChatSchema = new Schema({
  chatId: { type: Number, required: true },
  chatType: { type: String, required: true },
  eventCount: { type: Number, default: 0 },
  lastEventAt: { type: Date, default: null },
  admins: { type: [String], default: [] },
})

export type IChat = InferSchemaType<typeof ChatSchema>;

