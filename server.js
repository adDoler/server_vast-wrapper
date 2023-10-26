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

app = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const queryParams = parsedUrl.query.relise;

  console.log("Получен запрос:", queryParams);
  
  res.writeHead(200, { 
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "https://content.adriver.ru",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Allow-Headers": "Content-Type", });
  res.end("Параметры запроса выведены в консоль.\n");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});