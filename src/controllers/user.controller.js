const User = require("../models/user.model");
const Form = require("../models/form.model");
const Questions = require("../models/questions.model");
const Sequelize = require("sequelize");

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
      order: [["id","DESC"]],
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
  console.log(req.params.id)
  try {
    const user = await User.findOne({
      attributes: ["userName", "password", "email", "admin", "id", "stripeId"],
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

exports.CreatForm = async (req, res) => {
  try {
    const { userId, question, options } = req.body; // Assume the request includes the userId as well

    // Step 1: Create a new form associated with the user
    const newForm = await Form.create({ userId });

    // Step 2: Create a new question associated with the form (using formId)
    const newQuestion = await Questions.create({
      formId: newForm.id, // Use the newly created form's id as the formId
      question,
      options,
    });
    res.status(200).send({
      status: "success",
      data: newQuestion,
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
