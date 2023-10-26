const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://content.adriver.ru');
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
  acceptInvitation: ["https://example.com/acceptInvitation"],
  close: ["https://example.com/close"],
  collapse: ["https://example.com/collapse"],
  complete: ["https://example.com/complete"],
  creativeView: ["https://example.com/creativeView"],
  exitFullscreen: ["https://example.com/exitFullscreen"],
  expand: ["https://example.com/expand"],
  firstQuartile: ["https://example.com/firstQuartile"],
  fullscreen: ["https://example.com/fullscreen"],
  midpoint: ["https://example.com/midpoint"],
  mute: ["https://example.com/mute"],
  pause: ["https://example.com/pause"],
  progress: ["https://example.com/progress"],
  resume: ["https://example.com/resume"],
  rewind: ["https://example.com/rewind"],
  skip: ["https://example.com/skip"],
  start: ["https://example.com/start"],
  thirdQuartile: ["https://example.com/thirdQuartile"],
  unmute: ["https://example.com/unmute"]
};

for (const eventName in trackingEvents) {
  const eventUrl = trackingEvents[eventName];
  app.get(`/${eventName}`, (req, res) => {
    console.log(`Принят запрос для события ${eventName} по URL: ${eventUrl}`);
    res.send(`Запрос для события ${eventName} принят успешно`);
  });
}

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