import {regexes} from "./constants.mjs"

import verify from "jsonwebtoken/verify.js";

export function validation(req, res, next) {
  const {firstName, lastName, mobile, profilePicture, password} = req.body;
  if(!regexes.name.test(firstName)){
    return res.status(400).json({error: "first name can only contain alphabets"})
  }
  if(!regexes.name.test(lastName)){
    return res.status(400).json({error: "last name can only contain alphabets"})
  }
  if(!regexes.mobile.test(mobile)){
    return res.status(400).json({error: "mobile number should be 10-digits long"})
  }
  if(!firstName || !lastName || !mobile || !password || !profilePicture) {
    return res.status(400).json({error: "all are required fields"});
  }
  next()
}

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}