const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');

// Добавить заголовки CORS для разрешения доступа со всех доменов
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://content.adriver.ru', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); 
  next();
});

// Настроим Express для обслуживания статических файлов из папки 'public'
// и добавим заголовки CORS только для маршрутов, соответствующих статическим файлам
app.use('/public', express.static('public'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/xml'); // Указываем папку, в которую будут сохраняться загруженные файлы
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Сохраняем файл с его исходным именем
  },
});
const upload = multer({ storage });

// Обработчик POST-запроса для загрузки файлов
app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'Файл успешно загружен' });
});

app.get('/file-list', (req, res) => {
  const xmlDir = 'public/xml'; // Путь к папке с файлами XML
  fs.readdir(xmlDir, (err, files) => {
    if (err) {
      console.error('Ошибка чтения папки:', err);
      res.status(500).json({ error: 'Ошибка чтения папки' });
    } else {
      const xmlFiles = files.filter((file) => file.endsWith('.xml')); // Фильтруем только файлы с расширением .xml
      res.json({ files: xmlFiles });
    }
  });
});

// Далее настроить маршруты и логику вашего сервера

const port = 3000; // Порт, на котором будет работать сервер
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});