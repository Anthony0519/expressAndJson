const express = require('express')
const fs = require('fs')
const port = 2022
const app = express()
app.use(express.json())

 const filePath = "./dataBase.json"

 async function writeToFile(data){
    try {
        await fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.log(`an error occoured: ${error.message}`)
    }
 }

 async function readFromFile(){
    try {
       const data =  await fs.readFileSync(filePath, "utf8")
        return JSON.parse(data)
    } catch (error) {
        console.log(`unexpected error: ${error.message}`);
    }
 }
 
 app.get('/', (req,res)=>{
    res.send("welcome to my API")
 })

 app.post("/users/signUp", async(req,res)=>{
    const signUp = req.body

    const dataBase = await readFromFile()

    signUp.id = dataBase.length +1

    const users =  dataBase.find((users)=>users.userName === signUp.userName)

    if (!users) {
        dataBase.push(signUp)

        await writeToFile(dataBase)
    
        res.status(200).json({
        message: "successfully signedUP",
    })
    } 
    res.status(404).json({
        message: `username ${signUp.userName} has already been taken by another user`
    })
 })

 app.get('/users/login', async(req,res)=>{
    const login = req.body

    const dataBase = await readFromFile()

    const user = dataBase.find((user)=> user.email === login.email)
    const users = dataBase.find((users)=> users.password === login.password)

    if (!user) {
        res.status(400).json({
            message: "wrong email or password"
        })
    } else if(!users){
                res.status(400).json({
            message: "wrong email or password"
        })
    }
    else{
        res.status(200).json({
            message: "Login successfull",
            data: user
        })
    }
 })
 
app.listen(port,()=>{
    console.log(`server on port ${port}`)
})