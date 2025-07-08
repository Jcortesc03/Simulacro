# Simulacro


npm i mysql2 express cors dotenv uuid prisma nodemailer jsonwebtoken @google/generative-ai

npx prisma init

npx prisma  migrate dev --name inicial

npx prisma migrate dev --name nombre //esto es para generar las migraciones, busca diferencias entre el esquema prisma y MYSQL, modifica el MYSQL para que coincidan.

npx prisma db pull //Esto es para copiar la estructura de MYSQL al prisma como migración.

npx prisma reset //Eliminar todos los datos de las migraciones

Para usar ngrok, lo instalas, sigues los pasos del setup y ejecutas: ngrok http PORT(Generalmente el 3000)
