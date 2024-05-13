const { isAuth } = require("../../middlewares/auth");
const { getAllAttenders, getAttenderById, getAttenderByName, postAttender, deleteAttender, putAttender, deleteEventFromAttender } = require("../controllers/attender");

const attenderRouter = require("express").Router();

attenderRouter.get("/:id", getAttenderById);
attenderRouter.get("/name/:name", getAttenderByName);
attenderRouter.get("/", getAllAttenders);
attenderRouter.post("/",[isAuth], postAttender);
attenderRouter.put("/:id",[isAuth], putAttender);
attenderRouter.delete("/:attenderId/event/:eventId",[isAuth],deleteEventFromAttender);
attenderRouter.delete("/:id",[isAuth], deleteAttender);

module.exports = attenderRouter;
