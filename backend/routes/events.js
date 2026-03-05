const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.post("/create", async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json(event);
});

router.get("/", async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.put("/rsvp/:id", async (req, res) => {
  const event = await Event.findById(req.params.id);
  event.rsvpCount += 1;
  await event.save();
  res.json(event);
});

module.exports = router;