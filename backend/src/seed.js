import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
  const email = 'educator@eduvillage.test'
  const password = await bcrypt.hash('password123', 10)
  const educator = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, password, role: 'educator' }
  })

  const lesson = await prisma.lesson.create({
    data: { title: 'Intro to Letters', ownerId: educator.id, topic: 'Letters' }
  })

  const modules = ['Alphabet Overview', 'Vowels', 'Consonants'].map(title => ({
    title,
    lessonId: lesson.id
  }))
  await prisma.module.createMany({ data: modules })

  console.log('Seed complete')
}

main().finally(() => prisma.$disconnect())