import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Generamos el hash de la contraseña 'admin'
  const passwordHash = await bcrypt.hash('admin', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {
      // Opcional: Actualizamos el hash por si quedó mal guardado de antes
      passwordHash: passwordHash 
    },
    create: {
      nombre: 'Administrador General',
      email: 'admin@admin.com',
      passwordHash: passwordHash, // <-- AQUÍ USAMOS LA VARIABLE, NO EL TEXTO 'admin'
      rol: 'ADMIN', 
      dni: '132342342'
    },
  });

  console.log('Admin creado/actualizado:', admin.email);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());