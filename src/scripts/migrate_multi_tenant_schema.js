const { sequelize } = require('../config/database');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Create Organization Table
    console.log('Checking/Creating organizations table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id SERIAL PRIMARY KEY,
        id_code VARCHAR(36) NOT NULL UNIQUE,
        owner_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        document VARCHAR(50),
        plan_tier VARCHAR(50) DEFAULT 'free',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Add columns to Stores
    console.log('Adding organization_id and slug to stores...');
    
    // Add organization_id
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS organization_id INTEGER REFERENCES organizations(id);
    `);

    // Add slug
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    `);

    // Add config
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}';
    `);

    // Add status (if missing, though dump says it exists as active/inactive enum, but let's ensure it's compatible)
    // Dump says stores.status doesn't exist? Wait, dump says:
    // type character varying
    // No status column in dump for stores table!
    // Let's add status
    await sequelize.query(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
    `);


    // 3. Create StoreMember Table
    console.log('Checking/Creating store_members table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS store_members (
        id SERIAL PRIMARY KEY,
        id_code VARCHAR(36) NOT NULL UNIQUE,
        store_id INTEGER NOT NULL REFERENCES stores(id),
        user_id INTEGER REFERENCES users(id),
        invited_email VARCHAR(255),
        role VARCHAR(50) DEFAULT 'collaborator',
        permissions JSONB DEFAULT '[]',
        status VARCHAR(50) DEFAULT 'invited',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

run();
