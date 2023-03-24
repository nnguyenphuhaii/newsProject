require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
  console.log('Connected to database.');
});

const apiKey = process.env.NEWS_API_KEY;
const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

axios.get(apiUrl)
  .then((response) => {
    const articles = response.data.articles;
    const sql = 'INSERT INTO articles (title, description, url, imageUrl, publishedAt) VALUES ?';
    const values = articles.map((article) => [
      article.title,
      article.description,
      article.url,
      article.urlToImage,
      article.publishedAt
    ]);
    connection.query(sql, [values], (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        process.exit(1);
      }
      console.log(`Inserted ${results.affectedRows} rows into database.`);
      connection.end();
    });
  })
  .catch((error) => {
    console.error('Error fetching news:', error);
    process.exit(1);
  });
