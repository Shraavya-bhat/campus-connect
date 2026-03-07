const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post("/create", async (req, res) => {
  try {
    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      date: req.body.date,
      location: req.body.location,
      rsvpCount: 0,
    });

    const savedEvent = await event.save();
    res.json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// RSVP event
router.post("/rsvp/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    event.rsvpCount += 1;

    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE event
router.delete("/delete/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;