const User = require("../models/UsersModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  console.log(req.body);
  try {
    const { username, email, password } = req.body;

    // Check for existing username
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ msg: "Username already used", status: false });
    }

    // Check for existing email
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // Prepare the user object for response
    const userObj = user.toObject();
    delete userObj.password; // Remove password from response
    return res.status(201).json({ status: true, user: userObj });
  } catch (err) {
    console.error("Registration error:", err);
    next(err); // Pass error to the error handler middleware
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: "Incorrect Username or Password", status: false });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Incorrect Username or Password", status: false });
    }

    // Remove password from response
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    // Update the user with the new avatar
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    console.error("Set avatar error:", err);
    next(err);
  }
};

module.exports.getAllUsersById = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    console.error("Get users by ID error:", err);
    next(err);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.status(400).json({ msg: "User id is required" });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (err) {
    console.error("Logout error:", err);
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    next(err);
  }
};
