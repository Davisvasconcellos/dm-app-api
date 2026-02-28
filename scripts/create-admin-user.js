
console.log('Starting create-admin-user.js...');
require('dotenv').config();
const { User, sequelize } = require('../src/models');
const { v4: uuidv4 } = require('uuid');

async function createAdmin() {
  try {
    console.log('Connecting...');
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    const email = 'user1@example.com';
    const existing = await User.findOne({ where: { email } });

    if (existing) {
      console.log('⚠️ User already exists:', existing.toJSON());
      return;
    }

    console.log('⏳ Creating user...');
    const user = await User.create({
      name: 'User 1',
      email: email,
      password: 'aq1sw2de3fr4', // Plain text, hook should hash it
      role: 'admin', // Trying admin role
      phone: '11999999999',
      status: 'active',
      email_verified: true
    });

    console.log('✅ User created successfully!');
    console.log(user.toJSON());

  } catch (error) {
    console.error('❌ Error creating user:', error);
    if (error.original) {
      console.error('SQL Error:', error.original.message);
      console.error('SQL Detail:', error.original.detail);
    }
  } finally {
    await sequelize.close();
  }
}

createAdmin();
