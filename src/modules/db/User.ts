import { InferSchemaType, Schema, Mongoose } from "mongoose"

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
})

export type IUser = InferSchemaType<typeof UserSchema>;

