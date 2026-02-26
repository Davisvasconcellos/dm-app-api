const { sequelize } = require('./src/config/database');

async function check() {
  try {
    console.log('Testing connection to Hostinger...');
    await sequelize.authenticate();
    console.log('✅ Connection OK');
    
    // Try a simple query
    const [results] = await sequelize.query('SELECT 1 + 1 AS result');
    console.log('✅ Query OK:', results);
  } catch (err) {
    console.error('❌ Connection Failed!');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    if (err.original) {
      console.error('Original Error:', err.original.message);
      console.error('Error Code:', err.original.code);
      console.error('Errno:', err.original.errno);
    }
    process.exit(1);
  }
}

check();
