import {openDatabase,migrate} from './database.mjs';
try{process.loadEnvFile();}catch(error){if(error.code!=='ENOENT')throw error;}
const db=await openDatabase();try{await migrate(db);console.log('Migrações PostgreSQL verificadas e aplicadas.');}finally{await db.close();}
