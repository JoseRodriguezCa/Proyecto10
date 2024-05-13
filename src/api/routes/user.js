const { isAuth } = require("../../middlewares/auth");
const { uploadProfileImage } = require("../../middlewares/file");
const { getAllUsers, getUserById, register, PutUser, DeleteUser, getUserByName, login } = require("../controllers/user");

const userRouter = require("express").Router();

userRouter.get("/:id", getUserById);
userRouter.get("/userName/:userName",getUserByName);
userRouter.get("/", getAllUsers);
userRouter.post("/register",uploadProfileImage.single("profileimg"), register);
userRouter.post("/login", login);
userRouter.put("/:id",[isAuth],uploadProfileImage.single("profileimg"), PutUser);
userRouter.delete("/:id",[isAuth], DeleteUser);

module.exports = userRouter;