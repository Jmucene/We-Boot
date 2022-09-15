const sequelize = require('../config/connection');
const { User, Chat } = require('../models');
// const chatSeedData = require('./chatSeedData.json');
const userSeedData = require('./userSeedData.json');

const seedAll = async () => {
  await sequelize.sync({ force: true });
  
  await User.bulkCreate(userSeedData, {
    individualHooks: true,
    returning: true,
  });

  // await Chat.bulkCreate(chatSeedData, {
  //   individualHooks: true,
  //   returning: true,
  // });


  process.exit(0);
};

seedAll();
