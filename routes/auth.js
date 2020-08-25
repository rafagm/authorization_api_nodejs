const router = require("express").Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //Validate the data before creating a user
  try {
    await registerValidation(req.body);
  } catch (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  //Hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    rol: req.body.rol,
  });

  const userWithExistingEmail = await User.findOne({ email: newUser.email });
  if (userWithExistingEmail)
    return res.status(409).send({ error: "The email already exists" });

  try {
    const savedUser = await newUser.save();
    res.send({ userId: savedUser._id });
  } catch (error) {
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  //Validate login data
  try {
    await loginValidation(req.body);
  } catch (error) {
    return res.status(400).send(error.details[0].message);
  }

  const vagueResponseMessage = "The email or password is wrong";
  const vagueReponse = { error: vagueResponseMessage };

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(vagueReponse);

  const passwordsMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordsMatch) return res.status(400).send(vagueReponse);

  //Create and assign token
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, rol: user.rol },
    process.env.TOKEN_SECRET,
    { expiresIn: 300 }
  );
  res.header("Auth-Token", token).send({ token });
};

router.route("/login").post(login);

router.route("/register").post(register);

module.exports = router;
