import {PGlite} from '@electric-sql/pglite';
import {repository,migrate} from './backend/database.mjs';
import {createApp} from './server.mjs';
import {randomUUID,randomBytes,scryptSync} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {mkdir,access} from 'node:fs/promises';
try{process.loadEnvFile(fileURLToPath(new URL('./.env',import.meta.url)));}catch(error){if(error.code!=='ENOENT')throw error;}
if(process.env.NODE_ENV==='production'||process.env.DATABASE_URL)throw Error('O servidor de testes não pode usar configuração de produção ou DATABASE_URL.');
const dataDir=fileURLToPath(new URL('./data/local-dev/',import.meta.url));await mkdir(dataDir,{recursive:true});
// Folder copies can omit empty PostgreSQL directories. Restore only those in an existing cluster.
try{await access(new URL('./data/local-dev/PG_VERSION',import.meta.url));for(const dir of ['pg_notify','pg_tblspc','pg_replslot','pg_twophase','pg_stat','pg_stat_tmp','pg_snapshots','pg_commit_ts','pg_dynshmem','pg_serial','pg_logical/snapshots','pg_logical/mappings'])await mkdir(`${dataDir}/${dir}`,{recursive:true});}catch(error){if(error.code!=='ENOENT')throw error;}
const engine=new PGlite(dataDir);await engine.waitReady;
let tail=Promise.resolve();async function acquire(){let release;const next=new Promise(r=>release=r),previous=tail;tail=next;await previous;return release;}
const query=async(sql,params=[])=>params.length===0&&sql.includes(';')?(await engine.exec(sql)).at(-1):engine.query(sql,params);
const pool={async connect(){const release=await acquire();return{query,release};},async query(sql,params){const release=await acquire();try{return await query(sql,params);}finally{release();}},end:()=>engine.close()};
const db=repository(pool);db.development=true;await migrate(db);
await db.transaction(async()=>{await db.query('INSERT INTO company VALUES($1,$2) ON CONFLICT DO NOTHING',['primary','Escola Móbile · Testes locais']);if(!(await db.query('SELECT id FROM users WHERE email=$1',['admin@studyia.local'])).rows.length){const salt=randomBytes(16).toString('hex'),hash='scrypt$'+salt+'$'+scryptSync('admin',salt,64,{N:32768,r:8,p:1,maxmem:64*1024*1024}).toString('hex');await db.query('INSERT INTO users(id,company_id,email,name,password,role) VALUES($1,$2,$3,$4,$5,$6)',[randomUUID(),'primary','admin@studyia.local','Administrador de testes',hash,'admin']);}});
const app=createApp({database:db,apiKey:process.env.OPENAI_API_KEY||'',model:process.env.OPENAI_MODEL||''});app.listen(3000,'127.0.0.1',()=>console.log('StudyIA local: http://127.0.0.1:3000/#account · usuário admin · senha admin · banco PostgreSQL embarcado de desenvolvimento'));
let stopping=false;async function close(){if(stopping)return;stopping=true;app.close(async()=>{await db.close();process.exit(0);});}process.on('SIGINT',close);process.on('SIGTERM',close);
