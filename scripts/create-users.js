
console.log('Starting create-users.js...');
require('dotenv').config();
const { User, sequelize } = require('../src/models');
const { v4: uuidv4 } = require('uuid');

async function createUsers() {
  try {
    console.log('Connecting...');
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    // Create Admin User
    const adminEmail = 'admin@example.com';
    const adminExists = await User.findOne({ where: { email: adminEmail } });

    if (adminExists) {
      console.log('⚠️ Admin user already exists:', adminEmail);
    } else {
      console.log('⏳ Creating Admin user...');
      const admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: 'admin_password_123', 
        role: 'admin',
        phone: '11999999999',
        status: 'active',
        email_verified: true
      });
      console.log('✅ Admin user created:', admin.email);
    }

    // Create Master User
    const masterEmail = 'master@example.com';
    const masterExists = await User.findOne({ where: { email: masterEmail } });

    if (masterExists) {
        console.log('⚠️ Master user already exists:', masterEmail);
    } else {
        console.log('⏳ Creating Master user...');
        const master = await User.create({
            name: 'Master User',
            email: masterEmail,
            password: 'master_password_123',
            role: 'master',
            phone: '11888888888',
            status: 'active',
            email_verified: true
        });
        console.log('✅ Master user created:', master.email);
    }

  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await sequelize.close();
  }
}

createUsers();
