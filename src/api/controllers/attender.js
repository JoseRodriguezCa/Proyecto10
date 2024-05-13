const Attender = require("../models/attender");
const Event = require("../models/event");

const getAllAttenders = async (req, res, next) => {
  try {
    const attenders = await Attender.find()
      .populate({
        path: "event",
        select: "tittle _id",
      })
      .populate({
        path: "user",
        select: "userName profileimg",
      });
    return res.status(200).json(attenders);
  } catch (error) {
    console.log(error);
    return res.status(404).json("error en get");
  }
};

const getAttenderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attender = await Attender.findById(id)
      .populate({
        path: "event",
        select: "tittle _id",
      })
      .populate({
        path: "user",
        select: "userName profileimg",
      });
    return res.status(200).json(attender);
  } catch (error) {
    return res.status(404).json("error en getbyid");
  }
};

const getAttenderByName = async (req, res, next) => {
  try {
    const { name } = req.params;
    const attender = await Attender.find({ name })
      .populate({
        path: "event",
        select: "tittle _id",
      })
      .populate({
        path: "user",
        select: "userName profileimg",
      });
    if (attender.length === 0) {
      return res
        .status(404)
        .json("No se encontró ningún asistente con el nombre especificado.");
    }
    return res.status(200).json(attender);
  } catch (error) {
    return res.status(404).json("error en getbyname");
  }
};

const postAttender = async (req, res, next) => {
  try {
    const { name, event } = req.body;
    const { id } = req.user;
    const existingAttender = await Attender.findOne({ name, event });
    const existingEvent = await Event.findById(event);
    if (existingAttender) {
      return res
        .status(400)
        .json({ error: "El asistente ya está registrado para este evento." });
    }
    const newAttender = new Attender(req.body);
    newAttender.user = id;
    const attender = await newAttender.save();
    existingEvent.attender.push(attender._id);
    await existingEvent.save();
    return res.status(201).json(attender);
  } catch (error) {
    console.log(error);
    return res.status(404).json("error en post");
  }
};

const putAttender = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldAttender = await Attender.findById(id);
    const newAttender = new Attender(req.body);
    if (
      oldAttender.user._id.toString() === req.user._id.toString() ||
      req.user.rol === "admin"
    ) {
      if (oldAttender.event.includes(req.body.event)) {
        return res.status(400).json("este asistente ya esta en el evento");
      } else {
        newAttender.event = [...oldAttender.event, ...newAttender.event];
      }

      newAttender._id = id;

      const attenderUpdated = await Attender.findByIdAndUpdate(
        id,
        newAttender,
        {
          new: true,
        }
      );
      if (req.body.event) {
        const findEvent = await Event.findById(req.body.event);
        findEvent.attender.push(newAttender._id);
        await findEvent.save();
      }
      return res.status(200).json(attenderUpdated);
    } else {
      return res.status(400).json("No estas autorizado");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("error en put");
  }
};

const deleteAttender = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldAttender = await Attender.findById(id);
    if (
      oldAttender.user._id.toString() === req.user._id.toString() ||
      req.user.rol === "admin"
    ) {
      const attenderDelete = await Attender.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ mensaje: "ha sido eliminado con exito", attenderDelete });
    } else {
      return res
        .status(400)
        .json("No estas autorizado para eliminar este asistente");
    }
  } catch (error) {
    return res.status(400).json("error en delete");
  }
};

const deleteEventFromAttender = async (req, res, next) => {
  try {
    const { eventId, attenderId } = req.params;
    const attender = await Attender.findById(attenderId);
    if (!attender) {
      return res.status(404).json({ error: "El asistente no existe." });
    }
    if (!attender.event.includes(eventId)) {
      return res
        .status(404)
        .json({ error: "El asistente no está registrado para este evento." });
    }
    if (
      attender.user._id.toString() === req.user._id.toString() ||
      req.user.rol === "admin"
    ) {
      await Event.findByIdAndUpdate(eventId, {
        $pull: { attender: attenderId },
      });
      const updatedAttender = await Attender.findByIdAndUpdate(
        attenderId,
        { $pull: { event: eventId } },
        { new: true }
      );
      return res.status(200).json({
        message: "El asistente no asistira al evento.",
        attender: updatedAttender,
      });
    } else {
      return res
        .status(400)
        .json("No estas autorizado para eliminar un evento");
    }
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ error: "Error al eliminar el evento del asistente." });
  }
};

module.exports = {
  getAllAttenders,
  getAttenderById,
  getAttenderByName,
  postAttender,
  deleteAttender,
  putAttender,
  deleteEventFromAttender,
};
