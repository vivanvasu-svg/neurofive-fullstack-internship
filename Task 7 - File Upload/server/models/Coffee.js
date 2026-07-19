import mongoose from 'mongoose';

const coffeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Coffee name is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be positive'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret.id = ret._id.toString();
                // Option to delete original _id and __v for cleaner JSON output
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

const Coffee = mongoose.model('Coffee', coffeeSchema);

export default Coffee;
