
const { sequelize } = require('../src/config/database');
const Event = require('../src/models/Event');
const EventQuestion = require('../src/models/EventQuestion');
const { v4: uuidv4 } = require('uuid');

async function testCreateEventWithQuestions() {
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
        name: 'Test Event with Questions ' + Date.now(),
        slug: 'test-event-quest-' + Date.now(),
        created_by: userId,
        description: 'Test description',
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00:00',
        end_time: '12:00:00',
        public_url: 'http://example.com',
        gallery_url: 'http://example.com/gallery',
        place: 'Test Place',
        status: 'draft',
        auto_checkin: false,
        requires_auto_checkin: false,
        auto_checkin_flow_quest: false,
        checkin_component_config: { test: true }
    };

    const t = await sequelize.transaction();

    try {
        const event = await Event.create(eventData, { transaction: t });
        console.log('✅ Event created successfully! ID:', event.id);

        const questionPayload = [
            {
                event_id: event.id,
                question: 'Question 1',
                type: 'text',
                required: true,
                is_public: true,
                order_index: 0
            },
            {
                event_id: event.id,
                question: 'Question 2',
                type: 'radio',
                choice_config: { options: ['A', 'B'] },
                required: false,
                is_public: true,
                order_index: 1
            }
        ];

        await EventQuestion.bulkCreate(questionPayload, { transaction: t });
        console.log('✅ Questions created successfully!');

        await t.commit();
        console.log('✅ Transaction committed.');
    } catch (err) {
        await t.rollback();
        console.error('❌ Transaction failed:', err);
        throw err;
    }

  } catch (error) {
    console.error('❌ Failed to create event with questions:', error.message);
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

testCreateEventWithQuestions();
