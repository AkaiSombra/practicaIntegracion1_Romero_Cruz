
import { Router } from "express"
import cartsModel from "../models/carts.models.js"

const router = Router()

class Carts{
    static carts = []

    constructor(){
        this.products = []
    }
}


router.post('/', async (req, res) => {
    try {
        const newCart = new Carts()
        const newCardDb = await cartsModel.create(newCart)

        res.status(200).send(`Su carrito con ID:${newCardDb._id} ha sido creado`)
        } catch (err){
             res.status(400).send(err.message)
        } 
})

router.get('/:cid', async (req, res) => {
    try {
        const cId = req.params.cid
        const cart = await cartsModel.findOne({ _id: cId})
        res.status(200).send(cart)
      } catch (err) {
        res.status(400).send(err.message)
      }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {

        const cartId = req.params.cid
        const productId = req.params.pid
 
        const cart = await cartsModel.findOne({ _id: cartId})

        const productIdSearch = cart.products.some((product) => {
            return product.id === productId
        })

        if(productIdSearch){
            await cartsModel.findOneAndUpdate({ _id: cartId, 'products.id': productId }, { $inc: { 'products.$.quantity': 1 } })
            res.status(200).send(`Se añadio stock en 1 al producto con ID:${productId}`)
        } else{
            await cartsModel.findOneAndUpdate({ _id: cartId}, {$addToSet: {products: {id: productId, quantity: 1}}})
            res.status(200).send(`Se agrego el producto con id: ${productId}`)
        }
        
        } catch (err){
            res.status(400).send(err.message)
        } 
})

export default router