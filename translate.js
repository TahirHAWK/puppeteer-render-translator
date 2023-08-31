const puppeteer = require('puppeteer');
const path = require('path');
require("dotenv").config();

async function waitFor(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}


exports.translateText = async function (req, res) {
  let sourceLang, targetLang, sourceString
  sourceString = req.params.textToTranslate
  sourceLang = req.params.sourceLang
  targetLang = req.params.targetLang

  if(sourceString.length > 4999){
    res.json('No can do amigo, string is too long.')
  } else{
    // for offline, the filepath must be here to work correctly
  const filePath = path.join(__dirname, './', `.cache`, 'puppeteer', 'chrome', '115.0.5790.170-chrome-win64', 'chrome-win64', 'chrome.exe');
  let launchOptions = { headless: true, args: ['--start-maximized'], executablePath: filePath };
  // for online, no need to specify the path
  // let launchOptions = {
  //   args: [
  //     "--disable-setuid-sandbox",
  //     "--no-sandbox",
  //     "--single-process",
  //     "--no-zygote",
  //   ],
  //   executablePath:
  //     process.env.NODE_ENV === "production"
  //       ? process.env.PUPPETEER_EXECUTABLE_PATH
  //       : puppeteer.executablePath(),
  // };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  // set viewport and user agent (just in case for nice viewing)
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');

 await page.goto(`https://translate.google.com/?sl=${sourceLang}&tl=${targetLang}&text=${sourceString}&op=translate`);

  // detect the source textarea for input data (source string)
  await page.waitForSelector('.er8xn');
  await waitFor(1000);

  // type the source string on the textarea
  // await page.type('.er8xn', sourceString);

  // wait for the result container to be available
  await page.waitForSelector('.usGWQd');
  await waitFor(3000);

  // get the translated result string
  let translatedResult = await page.evaluate(() => {
    return document.getElementsByClassName('usGWQd')[0].innerText;
  });
  translatedResult = translatedResult.replace(/Look up details/, '')
  // display the source and translated text to the console
  console.log(`${sourceLang}: ${sourceString}\n${targetLang}: ${translatedResult}`);
  
  await waitFor(1000);
  await browser.close();
  res.json(translatedResult) 
  }

  
}
