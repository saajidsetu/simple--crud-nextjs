import { Document, model, Schema } from 'mongoose';

interface RateDocument extends Document {
    user: Schema.Types.ObjectId | string;
    first_rate: string;
    all_rate: string;
    allday_rate:string;
    categorie: string;
    // additionalCategories: string;
    // featured_image: string;
}

const RateSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        first_rate: {
            type: String,
            required: false,
        },
        all_rate: {
            type: String,
            required: false,
        },
        allday_rate: {
            type: String,
            required: false,
        },
         categorie: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Rate = model<RateDocument>('rates', RateSchema);

export default Rate;
