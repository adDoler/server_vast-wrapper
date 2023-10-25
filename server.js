const express = require('express');
const app = express();

// Настроим Express для обслуживания статических файлов из папки 'public'
app.use(express.static('public'));

const port = 3000; // Порт, на котором будет работать сервер
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});