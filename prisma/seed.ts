import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@redhotfletes.com' },
    update: {},
    create: {
      nombre: 'Administrador General',
      email: 'admin@redhotfletes.com',
      passwordHash: passwordHash,
      rol: 'ADMIN', // Aquí asignamos el rol directamente
    },
  });

  console.log('Admin creado:', admin.email);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());