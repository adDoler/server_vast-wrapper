const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Путь к файлу, который нужно отправить
  const filePath = path.join(__dirname, 'xml/', 'test_new.xml');

  // Чтение файла
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Если произошла ошибка при чтении файла
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      // Отправка файла в ответе
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      res.end(data);
    }
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});