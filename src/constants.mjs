import { PrismaClient } from '@prisma/client'
export const prisma = new PrismaClient()

export const regexes = {
  name: /^[a-z]+$/i,
  mobile: /^\d{10}$/
}