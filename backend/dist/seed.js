import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    const email = 'educator@eduvillage.test';
    const password = await bcrypt.hash('password123', 10);
    const educator = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, password, role: 'educator' }
    });
    const lessons = [
        { title: 'Intro to Letters', ownerId: educator.id },
        { title: 'Basic Numbers', ownerId: educator.id },
        { title: 'Colors 101', ownerId: educator.id }
    ];
    for (const l of lessons) {
        await prisma.lesson.upsert({
            where: { id: `${l.title}` }, // fake unique via title keying
            update: {},
            create: { title: l.title, ownerId: l.ownerId }
        }).catch(async () => {
            // fallback if no unique constraint on title
            await prisma.lesson.create({ data: l });
        });
    }
    console.log('Seeded lessons and educator:', educator.email);
}
main().finally(() => prisma.$disconnect());
