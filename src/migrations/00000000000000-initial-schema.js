
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Plans (Independent)
    await queryInterface.createTable('plans', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      features: { type: Sequelize.JSON }, // Postgres supports JSON
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 2. Football Teams (Independent)
    await queryInterface.createTable('football_teams', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false },
      short_name: { type: Sequelize.STRING },
      abbreviation: { type: Sequelize.STRING(10) },
      shield: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 3. Users (Depends on Plans, Football Teams)
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(255), unique: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(255), unique: true },
      phone: { type: Sequelize.STRING(20) },
      password_hash: { type: Sequelize.STRING(255), allowNull: false },
      role: { type: Sequelize.ENUM('master', 'admin', 'manager', 'waiter', 'customer'), allowNull: false, defaultValue: 'customer' },
      google_id: { type: Sequelize.STRING, unique: true },
      google_uid: { type: Sequelize.STRING, unique: true },
      avatar_url: { type: Sequelize.STRING },
      birth_date: { type: Sequelize.DATEONLY },
      address_street: { type: Sequelize.STRING },
      address_number: { type: Sequelize.STRING(20) },
      address_complement: { type: Sequelize.STRING },
      address_neighborhood: { type: Sequelize.STRING },
      address_city: { type: Sequelize.STRING },
      address_state: { type: Sequelize.STRING(2) },
      address_zip_code: { type: Sequelize.STRING(10) },
      email_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      status: { type: Sequelize.ENUM('active', 'inactive', 'pending_verification', 'banned'), allowNull: false, defaultValue: 'active' },
      team_user: { type: Sequelize.INTEGER, references: { model: 'football_teams', key: 'id' } },
      plan_id: { type: Sequelize.INTEGER }, // FK added later
      plan_start: { type: Sequelize.DATEONLY },
      plan_end: { type: Sequelize.DATEONLY },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: true } // Some models use updated_at, some don't. Safe to add.
    });

    // 4. Stores (Establishments) (Depends on Users)
    await queryInterface.createTable('stores', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(255), unique: true },
      owner_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      address: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      zip_code: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      logo_url: { type: Sequelize.STRING },
      cover_url: { type: Sequelize.STRING },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 5. Store Schedules
    await queryInterface.createTable('store_schedules', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      day_of_week: { type: Sequelize.INTEGER, allowNull: false }, // 0-6
      open_time: { type: Sequelize.TIME, allowNull: false },
      close_time: { type: Sequelize.TIME, allowNull: false },
      is_closed: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 6. Events
    await queryInterface.createTable('events', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(36), unique: true }, // UUID
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      created_by: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      start_time: { type: Sequelize.TIME },
      end_time: { type: Sequelize.TIME },
      status: { type: Sequelize.ENUM('draft', 'published', 'cancelled', 'completed'), defaultValue: 'draft' },
      slug: { type: Sequelize.STRING, unique: true },
      banner_url: { type: Sequelize.STRING },
      card_background_type: { type: Sequelize.ENUM('image', 'color'), defaultValue: 'image' },
      auto_checkin_enabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      auto_checkin_config: { type: Sequelize.JSON },
      deleted_at: { type: Sequelize.DATE }, // Added for paranoid: true
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 7. Event Guests
    await queryInterface.createTable('event_guests', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(36), unique: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'events', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'declined', 'checked_in'), defaultValue: 'pending' },
      check_in_time: { type: Sequelize.DATE },
      check_in_method: { type: Sequelize.ENUM('manual', 'qrcode', 'facial', 'auto_checkin') },
      ticket_code: { type: Sequelize.STRING, unique: true },
      selfie_url: { type: Sequelize.TEXT }, // Changed to TEXT in later migration
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 8. Event Questions (QA)
    await queryInterface.createTable('event_questions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'events', key: 'id' }, onDelete: 'CASCADE' },
      question: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.ENUM('text', 'boolean', 'choice'), defaultValue: 'text' },
      required: { type: Sequelize.BOOLEAN, defaultValue: false },
      order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
      is_public: { type: Sequelize.BOOLEAN, defaultValue: false },
      choice_config: { type: Sequelize.JSON },
      auto_checkin_enabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 9. Event Responses
    await queryInterface.createTable('event_responses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'events', key: 'id' }, onDelete: 'CASCADE' },
      question_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'event_questions', key: 'id' }, onDelete: 'CASCADE' },
      guest_id: { type: Sequelize.INTEGER, references: { model: 'event_guests', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
      response_text: { type: Sequelize.TEXT },
      response_boolean: { type: Sequelize.BOOLEAN },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 10. Jams & Songs (Music Module)
    await queryInterface.createTable('event_jams', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(36), unique: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'events', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('active', 'inactive', 'archived'), defaultValue: 'active' },
      settings: { type: Sequelize.JSON },
      order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('event_jam_music_catalog', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      discogs_id: { type: Sequelize.INTEGER, unique: true },
      title: { type: Sequelize.STRING, allowNull: false },
      artist: { type: Sequelize.STRING },
      cover_image: { type: Sequelize.STRING },
      thumb_image: { type: Sequelize.STRING },
      year: { type: Sequelize.STRING },
      genre: { type: Sequelize.JSON },
      style: { type: Sequelize.JSON },
      extra_data: { type: Sequelize.JSON },
      usage_count: { type: Sequelize.INTEGER, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('event_jam_songs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(36), unique: true },
      jam_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'event_jams', key: 'id' }, onDelete: 'CASCADE' },
      catalog_id: { type: Sequelize.INTEGER, references: { model: 'event_jam_music_catalog', key: 'id' }, onDelete: 'SET NULL' },
      title: { type: Sequelize.STRING, allowNull: false },
      artist: { type: Sequelize.STRING },
      cover_image: { type: Sequelize.STRING },
      key: { type: Sequelize.STRING(10) },
      tempo_bpm: { type: Sequelize.INTEGER },
      notes: { type: Sequelize.TEXT },
      status: { type: Sequelize.ENUM('planned', 'open_for_candidates', 'on_stage', 'played', 'canceled'), defaultValue: 'planned' },
      ready: { type: Sequelize.BOOLEAN, defaultValue: false },
      release_batch: { type: Sequelize.INTEGER },
      order_index: { type: Sequelize.INTEGER, defaultValue: 0 },
      extra_data: { type: Sequelize.JSON },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('event_jam_song_instrument_slots', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      jam_song_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'event_jam_songs', key: 'id' }, onDelete: 'CASCADE' },
      instrument: { type: Sequelize.STRING, allowNull: false },
      slots: { type: Sequelize.INTEGER, defaultValue: 1 },
      required: { type: Sequelize.BOOLEAN, defaultValue: true },
      fallback_allowed: { type: Sequelize.BOOLEAN, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('event_jam_song_candidates', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(36), unique: true },
      jam_song_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'event_jam_songs', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      instrument: { type: Sequelize.STRING, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected', 'confirmed'), defaultValue: 'pending' },
      is_guest: { type: Sequelize.BOOLEAN, defaultValue: false },
      guest_name: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('event_jam_song_ratings', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      jam_song_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'event_jam_songs', key: 'id' }, onDelete: 'CASCADE' },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      stars: { type: Sequelize.INTEGER, allowNull: false },
      rated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('event_jam_music_suggestions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      event_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'events', key: 'id' }, onDelete: 'CASCADE' },
      catalog_id: { type: Sequelize.INTEGER, references: { model: 'event_jam_music_catalog', key: 'id' }, onDelete: 'SET NULL' },
      suggested_by: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' }, onDelete: 'SET NULL' },
      title: { type: Sequelize.STRING, allowNull: false },
      artist: { type: Sequelize.STRING },
      cover_image: { type: Sequelize.STRING },
      votes: { type: Sequelize.INTEGER, defaultValue: 0 },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 11. Financial Module
    await queryInterface.createTable('financial_bank_accounts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      bank_name: { type: Sequelize.STRING },
      account_type: { type: Sequelize.STRING },
      initial_balance: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      current_balance: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      is_default: { type: Sequelize.BOOLEAN, defaultValue: false },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      allowed_payment_methods: { type: Sequelize.JSON },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('financial_categories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.ENUM('income', 'expense'), allowNull: false },
      color: { type: Sequelize.STRING },
      icon: { type: Sequelize.STRING },
      parent_id: { type: Sequelize.INTEGER, references: { model: 'financial_categories', key: 'id' }, onDelete: 'SET NULL' },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('financial_cost_centers', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      code: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('financial_parties', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      type: { type: Sequelize.ENUM('customer', 'supplier', 'employee', 'partner', 'other'), defaultValue: 'other' },
      document: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING },
      phone: { type: Sequelize.STRING },
      notes: { type: Sequelize.TEXT },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('financial_recurrences', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      description: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      type: { type: Sequelize.ENUM('income', 'expense'), allowNull: false },
      frequency: { type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'yearly'), allowNull: false },
      interval: { type: Sequelize.INTEGER, defaultValue: 1 },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY },
      next_due_date: { type: Sequelize.DATEONLY },
      category_id: { type: Sequelize.INTEGER, references: { model: 'financial_categories', key: 'id' } },
      cost_center_id: { type: Sequelize.INTEGER, references: { model: 'financial_cost_centers', key: 'id' } },
      party_id: { type: Sequelize.INTEGER, references: { model: 'financial_parties', key: 'id' } },
      bank_account_id: { type: Sequelize.INTEGER, references: { model: 'financial_bank_accounts', key: 'id' } },
      payment_method: { type: Sequelize.STRING },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      last_generated_date: { type: Sequelize.DATEONLY },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('financial_transactions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      store_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'stores', key: 'id' }, onDelete: 'CASCADE' },
      description: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      type: { type: Sequelize.ENUM('income', 'expense', 'transfer'), allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'paid', 'cancelled'), defaultValue: 'pending' },
      due_date: { type: Sequelize.DATEONLY, allowNull: false },
      payment_date: { type: Sequelize.DATEONLY },
      category_id: { type: Sequelize.INTEGER, references: { model: 'financial_categories', key: 'id' }, onDelete: 'SET NULL' },
      account_id: { type: Sequelize.INTEGER, references: { model: 'financial_bank_accounts', key: 'id' }, onDelete: 'SET NULL' }, // From Account
      to_account_id: { type: Sequelize.INTEGER, references: { model: 'financial_bank_accounts', key: 'id' }, onDelete: 'SET NULL' }, // For Transfer
      party_id: { type: Sequelize.INTEGER, references: { model: 'financial_parties', key: 'id' }, onDelete: 'SET NULL' },
      cost_center_id: { type: Sequelize.INTEGER, references: { model: 'financial_cost_centers', key: 'id' }, onDelete: 'SET NULL' },
      recurrence_id: { type: Sequelize.INTEGER, references: { model: 'financial_recurrences', key: 'id' }, onDelete: 'SET NULL' },
      payment_method: { type: Sequelize.STRING },
      document_number: { type: Sequelize.STRING },
      notes: { type: Sequelize.TEXT },
      attachment_url: { type: Sequelize.TEXT },
      approval_status: { type: Sequelize.ENUM('pending', 'approved', 'rejected'), defaultValue: 'approved' },
      approved_by: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
      approved_at: { type: Sequelize.DATE },
      updated_by: { type: Sequelize.INTEGER, references: { model: 'users', key: 'id' } },
      deleted_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 12. Token Blocklist
    await queryInterface.createTable('token_blocklist', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      token: { type: Sequelize.STRING(512), allowNull: false, unique: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    // 13. System Modules
    await queryInterface.createTable('sys_modules', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      id_code: { type: Sequelize.STRING(36), unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('user_modules', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      module_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'sys_modules', key: 'id' }, onDelete: 'CASCADE' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

  },

  async down(queryInterface, Sequelize) {
    // Drop in reverse order of creation
    await queryInterface.dropTable('user_modules');
    await queryInterface.dropTable('sys_modules');
    await queryInterface.dropTable('token_blocklist');
    await queryInterface.dropTable('financial_transactions');
    await queryInterface.dropTable('financial_recurrences');
    await queryInterface.dropTable('financial_parties');
    await queryInterface.dropTable('financial_cost_centers');
    await queryInterface.dropTable('financial_categories');
    await queryInterface.dropTable('financial_bank_accounts');
    await queryInterface.dropTable('event_jam_music_suggestions');
    await queryInterface.dropTable('event_jam_song_ratings');
    await queryInterface.dropTable('event_jam_song_candidates');
    await queryInterface.dropTable('event_jam_song_instrument_slots');
    await queryInterface.dropTable('event_jam_songs');
    await queryInterface.dropTable('event_jam_music_catalog');
    await queryInterface.dropTable('event_jams');
    await queryInterface.dropTable('event_responses');
    await queryInterface.dropTable('event_questions');
    await queryInterface.dropTable('event_guests');
    await queryInterface.dropTable('events');
    await queryInterface.dropTable('store_schedules');
    await queryInterface.dropTable('stores');
    // Users depends on plans/teams, so drop users first
    await queryInterface.dropTable('users'); 
    await queryInterface.dropTable('football_teams');
    await queryInterface.dropTable('plans');
  }
};
