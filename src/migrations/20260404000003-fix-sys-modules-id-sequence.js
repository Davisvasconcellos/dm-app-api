'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const dialect = queryInterface.sequelize.getDialect();
      if (dialect !== 'postgres') return;

      await queryInterface.sequelize.query(
        `
          SELECT setval(
            pg_get_serial_sequence('sys_modules', 'id'),
            COALESCE((SELECT MAX(id) FROM sys_modules), 1),
            true
          );
        `,
        { transaction: t }
      );
    });
  },

  async down() {}
};

