const {
    login,
    register,
    getAllUsersById,
    setAvatar,
    logOut,
    getAllUsers,
  } = require("../controllers/UserController");
  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.get("/allusers/:id", getAllUsersById);
  router.get("/allusers", getAllUsersById);
  router.post("/setavatar/:id", setAvatar);
   router.get("/logout/:id", logOut);
  
  module.exports = router;