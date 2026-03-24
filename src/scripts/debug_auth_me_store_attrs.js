const { sequelize, User, StoreMember, Store, Organization } = require('../models');

async function main() {
  console.log('start');
  await sequelize.authenticate();
  console.log('db_ok');

  const userId = Number(process.env.USER_ID || 19);
  const user = await User.findByPk(userId, {
    include: [
      {
        model: StoreMember,
        as: 'storeMemberships',
        include: [
          {
            model: Store,
            as: 'store',
            attributes: ['id_code', 'name', 'slug', 'logo_url', 'banner_url'],
            include: [{ model: Organization, as: 'organization', attributes: ['id_code', 'name'] }]
          }
        ]
      }
    ]
  });

  if (!user) {
    console.log('user_not_found');
    return;
  }

  const memberships = user.storeMemberships || [];
  console.log('memberships', memberships.length);
  for (const membership of memberships) {
    const store = membership.store;
    console.log('store', store ? store.toJSON() : null);
  }
}

main()
  .then(() => sequelize.close())
  .catch(async (err) => {
    console.error(err);
    try {
      await sequelize.close();
    } catch (e) {}
    process.exitCode = 1;
  });
