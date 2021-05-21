const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/test', (req, res) => {
  res.sendStatus(200);
});

router.get('/file', (req, res) => {
  res.sendFile('./sound.mp3', {
    root: path.join(__dirname, '../'),
  });
});

module.exports = router;