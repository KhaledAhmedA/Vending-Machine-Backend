import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    deposit: number;
    role: 'buyer' | 'seller';
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deposit: { type: Number, default: 0 },
    role: { type: String, enum: ['buyer', 'seller'], required: true },
});

export default model<IUser>('User', userSchema);
