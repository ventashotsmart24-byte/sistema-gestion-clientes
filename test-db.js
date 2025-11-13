require('dotenv').config(); // <-- importante

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

client.connect()
  .then(() => client.query('SELECT NOW()'))
  .then(res => {
    console.log('✅ Conectado a Neon Postgres:', res.rows[0].now);
    return client.end();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
    client.end();
  });