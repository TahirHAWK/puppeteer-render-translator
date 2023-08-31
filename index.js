const translate =  require('./translate')
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Welcome to my custom translator api');
});
app.get('/translate/:sourceLang/:targetLang/:textToTranslate', translate.translateText)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
