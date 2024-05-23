const { deleteFile } = require("../../utils/deleteFile");
const { generateSign } = require("../../utils/jwt");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("error en getAll");
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("error en getByid");
  }
};

const getUserByName = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const user = await User.find({ userName });
    if (user.length === 0) {
      return res
        .status(404)
        .json("No se encontró ningún usuario con el nombre especificado.");
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("error en getByid");
  }
};

const register = async (req, res, next) => {
  try {
    if (req.body.rol !== "admin") {
      const { userName, email } = req.body;
      const existingUser = await User.findOne({
        $or: [{ userName }, { email }],
      });

      console.log("Datos recibidos:", { userName, email });

      if (existingUser) {
        return res
          .status(400)
          .json({
            message: "El nombre de usuario o correo electrónico ya está en uso",
          });
      }

      const newUser = new User(req.body);
      if (req.file) {
        newUser.profileimg = req.file.path;
      }
      const user = await newUser.save();
      return res.status(201).json(user);
    } else {
      return res.status(400).json("no pueden registrarte con ese rol");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("error en register");
  }
};

const PutUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: "El nombre de usuario o correo electrónico ya está en uso" });
    }
    const user = await User.findById(id);
    if (req.user._id.toString() === id || req.user.rol === "admin") {
      if (req.body.rol && req.user.rol !== "admin") {
        return res.status(400).json("no tienes permiso para cambiar el rol");
      }
      const newUser = new User(req.body);
      newUser._id = id;

      if (req.file) {
        if (user.profileimg) {
          deleteFile(user.profileimg);
        }
        newUser.profileimg = req.file.path;
      }

      const userUpdated = await User.findByIdAndUpdate(id, newUser, {
        new: true,
      });
      return res.status(200).json(userUpdated);
    } else {
      return res.status(400).json("No puedes modificar a otro usuario");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("error en put");
  }
};

const DeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user._id.toString() === id || req.user.rol === "admin") {
      const userDeleted = await User.findByIdAndDelete(id);
      deleteFile(userDeleted.profileimg);
      return res
        .status(200)
        .json({ mensaje: "usuario eliminado", userDeleted });
    } else {
      return res.status(400).json("No estas autorizado");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("error en delete");
  }
};

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json("Usuario o Contraseña incorrectos");
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id);
      return res.status(200).json({ token, user });
    }
    return res.status(400).json("Usuario o Contraseña incorrectos");
  } catch (error) {
    return res.status(400).json("error en login");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  register,
  PutUser,
  DeleteUser,
  login,
  getUserByName,
};
