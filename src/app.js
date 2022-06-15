var express = require('express');
const sequelize = require('./config/db.config');
const cors = require("cors");
const { authRoutes, userRoutes } = require('./routes/index.routes');
const globalError = require('./middlewares/globalError')

var app = express();

app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "500mb" }));
<<<<<<< HEAD
app.use("/test", express.static("test"));
app.use("/static", express.static("static"));

=======
// app.use("/test", express.static("test"));
// app.use("/build", express.static('/build/index.html'));
// app.get("/view", (req, res) => {
//   res.render('build');
// });
>>>>>>> 0f10bf495cb98f1d6d158f3cd9ec09b7daf82f00

const connectWithDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection To Database Has Been Established');
  } catch (error) {
    console.log('There is some error in syncing models', error);
  }
}

connectWithDB();


app.use(cors({
  origin: "*"
}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the beginnings of nothingness." });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

// passport.use(getJwtStrategy())
app.use(globalError);


module.exports = app;
