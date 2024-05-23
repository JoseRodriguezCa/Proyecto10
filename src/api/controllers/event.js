const { deleteFile } = require("../../utils/deleteFile");
const Attender = require("../models/attender");
const Event = require("../models/event");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate({
        path: "attender",
        select: "name email user",
      })
      .populate({
        path: "user",
        select: "userName profileimg",
      });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(400).json("error en getAll");
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate({
        path: "attender",
        select: "name email user",
      })
      .populate({
        path: "user",
        select: "userName profileimg",
      });
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json("error en getByid");
  }
};

const getEventByName = async (req, res, next) => {
  try {
    const { title } = req.params;
    const event = await Event.find({ title })
      .populate({
        path: "attender",
        select: "name email user",
      })
      .populate({
        path: "user",
        select: "userName profileimg",
      });
    if (event.length === 0) {
      return res
        .status(404)
        .json("No se encontró ningún evento con el nombre especificado.");
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(400).json("error en getByid");
  }
};

const postEvent = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title } = req.body;
    const oldEvent = await Event.findOne({ title });
    if (oldEvent) {
      return res.status(400).json({ message: "Ya existe un evento con este nombre" });
    }
    const newEvent = new Event(req.body);
    if(req.file) {
      newEvent.poster = req.file.path;
    }
    newEvent.user = id;
    const event = await newEvent.save();
    return res.status(201).json(event);
  } catch (error) {
    console.log(error);
    console.log(error);
    return res.status(400).json("error en post");
  }
};

const putEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldEventByTitle = await Event.findOne({ title });
    if (oldEventByTitle) {
      return res.status(400).json({ message: "Ya existe un evento con este nombre" });
    }
    const oldEvent = await Event.findById(id);
    const newEvent = new Event(req.body);
    if (
      oldEvent.user._id.toString() === req.user._id.toString() ||
      req.user.rol === "admin"
    ) {
      if (oldEvent.attender.includes(req.body.attender)) {
        return res.status(400).json("este asistente ya esta en el evento");
      } else {
        newEvent.attender = [...oldEvent.attender, ...newEvent.attender];
      }
      newEvent._id = id;

      if(req.file) {
        newEvent.poster = req.file.path;
        deleteFile(oldEvent.poster);
      }

      const EventUpdated = await Event.findByIdAndUpdate(id, newEvent, {
        new: true,
      });

      if (req.body.attender) {
        const findAttender = await Attender.findById(req.body.attender);
        findAttender.event.push(newEvent._id);
        await findAttender.save();
      }
      return res.status(200).json(EventUpdated);
    } else {
      return res
        .status(400)
        .json("no estas autorizado para editar este evento");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("error en put");
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oldEvent = await Event.findById(id);
    if (
      oldEvent.user._id.toString() === req.user._id.toString() ||
      req.user.rol === "admin"
    ) {
      const eventDeleted = await Event.findByIdAndDelete(id);
      deleteFile(eventDeleted.poster);
      return res
        .status(200)
        .json({ mensaje: "ha sido eliminado con exito", eventDeleted });
    } else {
      return res
        .status(400)
        .json("No estas autoziado para eliminar este evento");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json("error en delete");
  }
};

const deleteAttenderFromEvent = async (req, res, next) => {
  try {
    const { attenderId, eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "El evento no existe." });
    }
    if (!event.attender.includes(attenderId)) {
      return res
        .status(404)
        .json({ error: "El asistente no está registrado para este evento." });
    }
    if (
      event.user._id.toString() === req.user._id.toString() ||
      req.user.rol === "admin"
    ) { 
      await Attender.findByIdAndUpdate(attenderId, { $pull: { event: eventId } });
      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $pull: { attender: attenderId } },
        { new: true }
      );
      return res.status(200).json({
        message: "asistente eliminado del evento.",
        attender: updatedEvent,
      });
    }else {
      return res
      .status(400)
      .json({ error: "No estas autorizado para eliminar al asistente del evento." });
    }

  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ error: "Error al eliminar el evento del asistente." });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  postEvent,
  putEvent,
  deleteEvent,
  getEventByName,
  deleteAttenderFromEvent,
};
