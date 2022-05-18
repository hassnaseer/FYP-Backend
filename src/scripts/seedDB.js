const { User } = require('../models/index');
const bcrypt = require("bcryptjs");
const createAdminUser = async () => {
  const adminUser = {
    firstName: "Admin",
    lastName: "Admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("Password@1", 8),
    phoneNo: "03244323453",
    userName: "admin",
    role: 0
  };
  await User.create(adminUser);
}


const seedDB = async () => {
  try {
    await createAdminUser();
  } catch (error) {
    console.log('There is some error in seeding database', error)
  }
}

seedDB()