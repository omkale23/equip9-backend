import express from "express";
import { PrismaClient } from '@prisma/client'
import { hash, verify } from "argon2";
import { validation } from "./middlewares.mjs";
import sign from "jsonwebtoken/sign.js";


const app = express();
app.use(express.json())

const prisma = new PrismaClient()

app.get("/", async (req, res)=> {
  const users = await prisma.user.findMany();
  return res.json({users})
});

app.post("/register", validation, async (req, res) => {
  try {
    const {firstName, lastName, mobile, profilePicture, password} = req.body;

    const hashedPassword = await hash(password)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        mobile,
        password: hashedPassword,
        profilePicture
      }
    })
    console.log({user})
    return res.status(201).json({"response": "done"})
  } catch (error) {
    console.error({error})
    return res.status(500).json({response: "Something went wrong"})
  }
})

app.post("/login", async (req, res) => {
  try {
    const {mobile, password} = req.body;

    const user = await prisma.user.findFirst({
      where: {
        mobile
      }
    })

    if(!user) {
      return res.status(404).json({error: "User does not exist"})
    }

    const isCorrectPassword = verify(user.password, password)

    if(!isCorrectPassword) {
      return res.status(401).json({error: "Incorrect password"})
    }
    const token = sign({mobile}, process.env.SECRET, { expiresIn: '1800s' })
    return res.json({token})
  } catch (error) {
    return res.status(500).json({response: "Something went wrong"})
  }
})

app.listen(8000, ()=>{
  console.log("Server started at port 8000 🚀")
})