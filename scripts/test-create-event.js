
require('dotenv').config();
const { sequelize } = require('../src/config/database');
const Event = require('../src/models/Event');
const { v4: uuidv4 } = require('uuid');

async function testCreateEvent() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected.');

    // Get a user
    const [users] = await sequelize.query('SELECT id FROM users LIMIT 1');
    if (!users.length) {
      console.error('❌ No users found. Cannot create event.');
      return;
    }
    const userId = users[0].id;
    console.log('Using user ID:', userId);

    const eventData = {
        name: 'Test Event Sequelize ' + Date.now(),
        slug: 'test-event-seq-' + Date.now(),
        created_by: userId,
        description: 'Test description',
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00:00',
        end_time: '12:00:00',
        public_url: 'http://example.com',
        gallery_url: 'http://example.com/gallery',
        place: 'Test Place',
        resp_email: 'test@example.com',
        resp_name: 'Test Resp',
        resp_phone: '123456789',
        color_1: '#ffffff',
        color_2: '#000000',
        card_background: '#cccccc',
        card_background_type: 0,
        auto_checkin: false,
        requires_auto_checkin: false,
        auto_checkin_flow_quest: false,
        checkin_component_config: { test: true }
    };

    const event = await Event.create(eventData);
    console.log('✅ Event created successfully! ID:', event.id);

  } catch (error) {
    console.error('❌ Failed to create event:', error.message);
    if (error.original) {
        console.error('Original Error:', error.original); 
    }
    if (error.errors) {
        error.errors.forEach(e => console.error(`Validation Error: ${e.path} - ${e.message}`));
    }
  } finally {
    await sequelize.close();
  }
}

testCreateEvent();
