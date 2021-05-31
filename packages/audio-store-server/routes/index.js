const express = require('express');
const path = require('path');
const downloader = require('../services/downloader');

const router = express.Router();

router.get('/test', (req, res) => {
  res.sendStatus(200);
});

router.get('/file', (req, res) => {
  res.sendFile('./sound.mp3', {
    root: path.join(__dirname, '../'),
  });
});

router.get('/trackinfo', async (req, res) => {
  if (!req.query.url) {
    console.error('no url provided');
    res.sendStatus(400);
    return;
  }

  const {videoDetails} = await downloader.getInfo(req.query.url);
  const {title, lengthSeconds: length, videoId} = videoDetails;
  res.send({
    title,
    length,
    videoId,
  });
});

router.get('/download', async (req, res) => {
  if (!req.query.url) {
    console.error('no url provided');
    res.sendStatus(400);
    return;
  }

  const audioFileName = await downloader.download(req.query.url);
  res.sendFile(audioFileName, {
    root: path.join(__dirname, '../'),
  });
});

module.exports = router;
