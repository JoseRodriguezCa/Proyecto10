const { isAuth } = require("../../middlewares/auth");
const { uploadProfileImage, uploadPosterImage } = require("../../middlewares/file");
const {
  getAllEvents,
  getEventById,
  postEvent,
  putEvent,
  deleteEvent,
  getEventByName,
  deleteAttenderFromEvent,
} = require("../controllers/event");

const eventRouter = require("express").Router();

eventRouter.get("/:id", getEventById);
eventRouter.get("/title/:title", getEventByName);
eventRouter.get("/", getAllEvents);
eventRouter.post("/",[isAuth],uploadPosterImage.single("poster"), postEvent);
eventRouter.put("/:id",[isAuth],uploadPosterImage.single("poster"), putEvent);
eventRouter.delete("/:eventId/attender/:attenderId",[isAuth],deleteAttenderFromEvent);
eventRouter.delete("/:id",[isAuth], deleteEvent);

module.exports = eventRouter;
