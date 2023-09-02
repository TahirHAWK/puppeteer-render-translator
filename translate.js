const puppeteer = require('puppeteer');
const path = require('path');
const axios = require('axios')

async function waitFor(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}


exports.translateText = async function (req, res) {
  console.time('translate'); // Start the timer

  let sourceLang, targetLang, sourceString
  sourceString = req.params.textToTranslate
  sourceLang =  req.params.sourceLang
  targetLang =  req.params.targetLang
console.log('the source string is: ', req.params)
// how are you doing? can we talk? I really need to tell you something. Do you even think about me?
  if(sourceString.length > 4999){
    res.json('No can do amigo, string is too long.')
  } else{
    // for offline, the filepath must be here to work correctly
  const filePath = path.join(__dirname, './', `.cache`, 'puppeteer', 'chrome', '115.0.5790.170-chrome-win64', 'chrome-win64', 'chrome.exe');
  let launchOptions = { headless: true, args: ['--start-maximized'], executablePath: filePath };
  // for online, no need to specify the path
  // let launchOptions = { headless: true, args: ['--start-maximized'] };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
  await page.goto(`https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${sourceString}&op=translate`);

  // detect the source textarea for input data (source string)
  await page.waitForSelector('.er8xn');
  // await waitFor(1000);


  // wait for the result container to be available
  await page.waitForSelector('.usGWQd');
  // await waitFor(3000);

  // get the translated result string
  let translatedResult = await page.evaluate(() => {
    return document.getElementsByClassName('usGWQd')[0].innerText;
  });
  translatedResult = translatedResult.replace(/Look up details/, '')
  // display the source and translated text to the console
  console.log(`${sourceLang}: ${sourceString}\n${targetLang}: ${translatedResult}`);
  
  // await waitFor(1000);
  await browser.close();
  console.timeEnd('translate'); 
  res.json(translatedResult) 
  // return translatedResult
  }

  
}

exports.translateTextForm = function(req, res){
  

  res.redirect(`/translate/de/en/${encodeURIComponent(req.body.textToTranslate)}`)


}

exports.translateTextWithLibreTranslate = async function (req, res){
  console.log(req.params)

  // argostranslate, libretranslate are related projects that are open source and can be self hosted, but i used mirror links where they dont require api keys
  // the rough limit is 288 characters
  axios.post("https://translate.argosopentech.com/translate", {
    q: req.params.textToTranslate,
    source: req.params.sourceLang,
    target: req.params.targetLang
}, {
    headers: { "Content-Type": "application/json" }
})
    .then(function (response) {
      console.log(response.data)
        res.json(response.data.translatedText);
    })
    .catch(function (error) {
        console.error(error);
    });


}