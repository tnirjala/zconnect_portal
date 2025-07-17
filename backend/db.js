const sql = require('mssql');
require('dotenv').config(); // ✅ Load .env

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT, 10),
  options: {
    trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    encrypt: process.env.DB_ENCRYPT === 'true'
  },
  authentication: {
    type: 'ntlm',
    options: {
      domain: process.env.DB_DOMAIN,
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    }
  },
  connectionTimeout: 30000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('❌ SQL Server Connection Error:', err);
    process.exit(1);
  });

const execute = async (query, params = []) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    params.forEach(p => {
      request.input(p.name, p.type, p.value);
    });

    return await request.query(query);
  } catch (err) {
    console.error('Database error:', err);
    throw err;
  }
};

module.exports = {
  sql,
  poolPromise,
  execute
};
