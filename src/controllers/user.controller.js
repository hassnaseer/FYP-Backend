const User = require("../models/user.model");
const Contact = require("../models/contact.js");
const {sendEmail} = require('../utils/sendEmail')
const Plan = require("../models/plansModel");
const stripe = require("stripe")(process.env.STRIPE_URL);
const Sequelize = require("sequelize");
// const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

exports.index = async (req, res) => {
  try {
    const options = {
      attributes: [
        "id",
        "email",
        "phone",
        "country",
        "isActive",
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("firstName"),
            " ",
            Sequelize.col("lastName")
          ),
          "name",
        ],
      ],
      offset: (req.query.page - 1) * 5,
      limit: 5,
      order: [["id", "DESC"]],
      where: {
        role: 1,
      },
    };

    const users = await User.findAndCountAll(options);
    res.status(200).send({
      status: "success",
      data: {
        users: users.rows,
        pages: Math.ceil(users.count / 5),
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.getSingle = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: [
        "id",
        "email",
        "phone",
        "city",
        "country",
        "isActive",
        "firstName",
        "lastName",
        "gender",
        "age",
        "dob",
        [
          Sequelize.fn(
            "concat",
            Sequelize.col("firstName"),
            " ",
            Sequelize.col("lastName")
          ),
          "name",
        ],
      ],
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id);
    if (user.isActive) {
      await User.update(
        {
          isActive: 0,
        },
        { where: { id: req.params.id } }
      );
    } else {
      await User.update(
        {
          isActive: 1,
        },
        { where: { id: req.params.id } }
      );
    }

    user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.update = async (req, res) => {
  const { firstName, lastName, email, phone, country, city, gender, dob, age } =
    req.body;
  try {
    await User.update(
      {
        firstName,
        lastName,
        email,
        phone,
        country,
        city,
        gender,
        dob,
        age,
      },
      { where: { id: req.params.id } }
    );

    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id != 1) {
      await User.destroy({ where: { id: req.params.id } });

      res.status(200).send({
        status: "Deleted Successfully",
      });
    } else {
      res.status(400).send({
        status: "Bad Request",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.findPlans = async (req, res) => {
  try {
    const response = await Plan.findAll(
      { order: [["id", "ASCE"]] }
      );
    res.status(200).send({
      response,
      status: "Success",
      // message:"Successfully Paid"
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.stripePayment = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      description:
        "My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
      email: req.body.email,
      customer: req.body.customer_Id,
    });
    const subscription = await stripe.x.create({
      customer: req.body.stripePaymentId,
      items: [{ price: req.body.price }],
    });

    res.status(200).send({
      subscription,
      status: "Success",
      // message:"Successfully Paid"
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.contactRequest = async (req, res) => {
  let { subject, category, email, message } = req.body;
  try {
    const user = await Contact.create({
      subject,
      category,
      email,
      message,
    });
    await sendEmail(email, subject, message);
    res.status(200).send({
      status: "success",
      data: user,
      message: "Email sent successfully",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
