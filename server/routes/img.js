// A LARGE MAJORITY OF THIS CODE WAS TAKEN FROM THE FOLLOWING LINK
// https://namanrivaan.medium.com/how-to-upload-an-image-with-mern-stack-a6c02e0a26b7

const express = require("express");
const router = express.Router();
const Image = require("../models/image");

router.post("/storeImage", async (req, res) => {
  try {
    const { image } = req.body.image;
    if (!image) {
      return res.status(400).json({ msg: "Please enter an image URL" });
    }
    let newImage = new Image({
      image
    });
    newImage = await newImage.save();
    res.json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;