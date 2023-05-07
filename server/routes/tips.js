// A LARGE MARJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
// https://www.youtube.com/watch?v=HGgyd1bYWsE

const express = require("express");
const router = express.Router();
const db = require("../models/tips");

router.get("/", async (req, res) => {
  try {
    const tips = await db.Tips.find();
    res.status(200).json(tips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
