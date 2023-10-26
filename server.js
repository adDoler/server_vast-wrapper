const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); 
  next();
});

app.use('/public', express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/xml'); 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});
const upload = multer({ storage });

const trackingEvents = {
  acceptInvitation: ["acceptInvitation"],
  acceptInvitation1: ["acceptInvitation1"],
  close: ["close"],
  close1: ["close1"],
  collapse: ["collapse"],
  collapse1: ["collapse1"],
  complete: ["complete"],
  complete1: ["complete1"],
  creativeView: ["creativeView"],
  creativeView1: ["creativeView1"],
  exitFullscreen: ["exitFullscreen"],
  exitFullscreen1: ["exitFullscreen1"],
  expand: ["expand"],
  expand1: ["expand1"],
  firstQuartile: ["firstQuartile"],
  firstQuartile1: ["firstQuartile1"],
  fullscreen: ["fullscreen"],
  fullscreen1: ["fullscreen1"],
  midpoint: ["midpoint"],
  midpoint1: ["midpoint1"],
  mute: ["mute"],
  mute1: ["mute1"],
  pause: ["pause"],
  pause1: ["pause1"],
  progress: ["progress"],
  progress1: ["progress1"],
  resume: ["resume"],
  resume1: ["resume1"],
  rewind: ["rewind"],
  rewind1: ["rewind1"],
  skip: ["skip"],
  skip1: ["skip1"],
  start: ["start"],
  start1: ["start1"],
  thirdQuartile: ["thirdQuartile"],
  thirdQuartile1: ["thirdQuartile1"],
  unmute: ["unmute"],
  unmute1: ["unmute1"]
};

for (const eventName in trackingEvents) {
  const eventUrl = trackingEvents[eventName];
  app.get(`/${eventUrl[0]}`, (req, res) => {
    console.log(`Принят запрос для события ${eventName} по URL: ${eventUrl}`);
    const filePath = 'public/xml/event.gif';
  
    res.sendFile(filePath, { root: __dirname });
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Внутренняя ошибка сервера');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'Файл успешно загружен' });
});

app.get('/file-list', (req, res) => {
  const xmlDir = 'public/xml';
  fs.readdir(xmlDir, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки:', err);
      res.status(500).json({ error: 'Ошибка чтения папки' });
    } else {
      const xmlFiles = files.filter((file) => file.endsWith('.xml'));
      res.json({ files: xmlFiles });
    }
  });
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});