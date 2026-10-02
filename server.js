const fs = require("fs/promises")
const path = require("node:path")
const express = require("express")
const port = 3000
const filepath = path.join(__dirname, "db.json")
const app = express()

let cache = {}


async function readData(){
    let data = await fs.readFile(filepath, "utf-8")
    return JSON.parse(data)
}

async function delayreadData(){
    await new Promise((res, rej)=>{
        setTimeout(res, 2000)
    })
    
    return await readData()
}

delayreadData()

app.get("/products", async (req, res)=>{
    let key = req.url
    let value = cache[key]
    try{
        if(value){
            console.log("Cache made for /products")
            return res.json(value)
        }
        let products = await delayreadData()
        cache[key] = products
        res.json(products)
    }catch(err){
        console.log(err)
    }

})

app.get("/products/:id", async (req, res)=>{
    // let key = req.url
    // let value = cache[key]
    try{
        let id = Number(req.params.id)

        if(cache[`products/${id}`]){
            console.log(`Cache made for /products/${id}`)
            return res.json(cache[`products/${id}`])
        }
        let products = await delayreadData()
        let data = products.find((product)=> product.id === id)
        cache[`products/${id}`] = data
        res.json(data)
    }catch(err){
        console.log(err)
    }
})

app.listen(port, ()=>{
    console.log("Server is running ....")
})







