const translate =  require('./translate')
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const bodyParser = require('body-parser');

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));

app.get('/', (req, res) => {
  
const filePath = path.join(__dirname, './views/home.html');
  res.sendFile(filePath);
});
app.get('/translate/:sourceLang/:targetLang/:textToTranslate', translate.translateText)
app.get('/translateapi/:sourceLang/:targetLang/:textToTranslate', translate.translateTextWithLibreTranslate)
app.post('/translate', translate.translateText)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
