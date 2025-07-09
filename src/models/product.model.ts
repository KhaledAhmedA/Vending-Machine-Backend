import { Schema, model, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    productName: string;
    cost: number;
    amountAvailable: number;
    sellerId: Types.ObjectId;
}

const productSchema = new Schema<IProduct>({
    productName: { type: String, required: true },
    cost: { type: Number, required: true },
    amountAvailable: { type: Number, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model<IProduct>('Product', productSchema);
