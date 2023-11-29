
import mongoose, { mongo } from 'mongoose'

mongoose.pluralize(null)

const collection = 'products'

const schema = new mongoose.Schema({
    //id: { type: Number , required: true, unique: true},
    title: { type: String, required: true, },
    description: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    price: { type: Number, required: true},
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true},
    category: { type: String, required: true},
    thumbnail: { type: String, require: false}
    },
    {
    versionKey: false
    
})

const model = mongoose.model(collection, schema)

export default model