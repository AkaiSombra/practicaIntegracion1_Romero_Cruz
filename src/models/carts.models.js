
import mongoose, { mongo } from 'mongoose'

mongoose.pluralize(null)

const collection = 'carts'

const schema = new mongoose.Schema({
    products: { type: Array, required: true }
    },
    {
    versionKey: false
    
})

const model = mongoose.model(collection, schema)

export default model