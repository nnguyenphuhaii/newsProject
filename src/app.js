const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');

const app = express();

// Kết nối đến cơ sở dữ liệu MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newsdb',
});
connection.connect();

// Thiết lập handlebars làm template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Xử lý request để lấy danh sách các bài báo từ cơ sở dữ liệu và render vào template
app.get('/', (req, res) => {
  connection.query('SELECT * FROM articles ORDER BY publishedAt DESC', (error, results, fields) => {
    if (error) throw error;
    res.render('home', { articles: results });
  });
});

// Khởi động server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
