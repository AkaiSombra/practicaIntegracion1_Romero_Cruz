
import { Router } from "express"
import productsModel from "../models/products.models.js"

const router = Router()

class ProductManager{
    static products = []

    constructor(product){
        this.product = product
    }    
  }

router.get('/', async (req, res) => {
    try {
        const products = await productsModel.find()
        res.status(200).send(products)
      } catch(error){
        res.status(400).send(error.message)
      }
})

router.get('/:pid', async (req, res) => {
    try {
        const pId = req.params.pid
        const product = await productsModel.findOne({ _id: pId})
        res.status(200).send(product)
      } catch (error) {
        res.status(404).send(error.message)
      }
})

router.post('/', async (req, res) => {
    try {

        const newProduct = req.body

        const productAdded = await productsModel.create(newProduct)
        res.status(200).send(`Producto agregado con ID: ${productAdded._id}`)

        } catch (err){
            res.status(400).send(err.message)
        } 
})

router.put('/:pid', async (req, res) => {  
    try {
        const pId = parseInt(req.params.pid)
        const productUpdate = req.body

        const updatedProduct = await productsModel.updateOne({ _id: pId}, productUpdate)
        res.status(200).send(`El producto con ID:${pId} ha sido actualizado correctamente, ${updatedProduct}`)
      } catch (error) {
        res.status(400).send(error.message)
      }
})

router.delete('/:pid', async (req, res) => {
    try{
        const pId = parseInt(req.params.pid)

        const deletedProduct = await productsModel.deleteOne( {_id: pId})

        res.status(200).send(`El producto con id ${pId} ha sido borrado exitosamente, ${deletedProduct}`)
    } catch(err){
        res.status(400).send(err.message)
    }
})

export default router