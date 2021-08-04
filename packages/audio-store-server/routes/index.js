const express = require('express');
const path = require('path');
const downloader = require('../services/downloader');
const DB = require('../services/db');

const router = express.Router();

const db = new DB();

router.get('/test', (req, res) => {
  res.sendStatus(200);
});

router.get('/tracks', async (req, res) => {
  const tracks = await db.getTracks();
  res.send(tracks);
});

router.post('/backupTracks', async (req, res) => {
  await db.backupTracks(req.body);
  res.sendStatus(200);
});

router.get('/playlists', async (req, res) => {
  const playlists = await db.getPlaylists();
  res.send(playlists);
});

router.post('/backupPlaylists', async (req, res) => {
  await db.backupPlaylists(req.body);
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

  const {audioFileName, parts} = await downloader.download(req.query.url);

  if (parts) {
    res.send({
      parts,
    });
  } else {
    res.sendFile(audioFileName, {
      root: path.join(__dirname, '../'),
      headers: {
        'Content-Type': 'audio/mp3',
      },
    });
  }
});

router.get('/download-part', async (req, res) => {
  if (!req.query.part) {
    console.error('missing params');
    res.sendStatus(400);
    return;
  }

  const audioFileName = req.query.part;

  res.sendFile(audioFileName, {
    root: path.join(__dirname, '../'),
    headers: {
      'Content-Type': 'audio/mp3',
    },
  });
});

module.exports = router;
