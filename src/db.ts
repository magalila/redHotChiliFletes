import { PrismaClient } from '@prisma/client';

// Esta instancia nos permitirá usar db.user, db.order, etc. en todo el proyecto
const db = new PrismaClient();

export default db;