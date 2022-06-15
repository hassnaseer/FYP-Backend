const Plan = require('../models/plansModel');
const bcrypt = require("bcryptjs");
const createPackagePlan = async () => {
  const createPackagePlan = 
  [
    {
    stripePlanId: "price_1L58H7Lo72iSiOk1LS3S1iOD",
    price: 0,
    trialDays: 7,
    interval: "free",
    description: "Free Package plan.",
    perMonth: 0,
  },
  {
    stripePlanId: "price_1L1nCwLo72iSiOk1Ur6sbaW9",
    price: 14.99,
    trialDays: 0,
    interval: "month",
    description: "Month Package plan.",
    perMonth: 14.99,
  },
  {
    stripePlanId: "price_1L1nCwLo72iSiOk1Qe40K5sU",
    price: 89.94,
    trialDays: 0,
    interval: "6 months",
    description: "6 months Package plan.",
    perMonth: 14.99,
  },
  {
    stripePlanId: "price_1L1nCwLo72iSiOk1OK7p4jMT",
    price: 178.8,
    trialDays: 0,
    interval: "yearly",
    description: "yearly Package plan.",
    perMonth: 14.99,
  },
]
  // await User.create(adminUser);
  if(!await Plan.count() > 0)
  await Plan.bulkCreate(createPackagePlan);
}


const seedDB = async () => {
  try {
    await createPackagePlan();
  } catch (error) {
    console.log('There is some error in seeding database', error)
  }
}

seedDB()