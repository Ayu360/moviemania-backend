import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    appUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: null },
    photoURL: { type: String, default: null },
    provider: { type: String, enum: ['google'], required: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;
export const User = model('User', userSchema);
