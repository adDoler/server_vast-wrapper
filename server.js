const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require("path");

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

app.use('/up', express.static('public'));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('Выберите файл для загрузки.');
    }
    res.status(200).send('Файл успешно загружен!');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/', (req, res) => {
  res.send("hdasda")
});
app.get('/files', (req, res) => {
  try {
    const files = fs.readdirSync('uploads/');
    res.status(200).json(files);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/open/:filename', (req, res) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', fileName);

    // Проверяем, существует ли файл
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Файл не найден.');
    }

    // Отправляем файл обратно клиенту
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});