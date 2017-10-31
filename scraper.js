const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const util = require('util');

// const moongoose = require('mongoose');
// const User = require('./models/user'); 

async function run() {
  // instantiating a browser - with property headless: false (so we can see it working)
  // By default, it is true. 
  const browser = await puppeteer.launch({
    headless: false
  });

  // now we need to instantiate a new page 
  const page = await browser.newPage();

  page.setViewport({
    width: 1366,
    height: 768
  });

  await page.goto('https://www.glassdoor.com/');

  // Signing in: 
  // setting sign-in link string id to a variable
  const SIGNIN_SELECTOR = '.sign-in';
  await page.click(SIGNIN_SELECTOR);

  const EMAIL_SELECTOR = '#signInUsername';
  const PW_SELECTOR = '#signInPassword';
  const SIGNIN_BTN = '#signInBtn';
  /* * * * * 
    wait for all selectors and btn to be on page
  * * * * */
  await page.waitForSelector(EMAIL_SELECTOR);
  await page.waitForSelector(PW_SELECTOR);
  await page.waitForSelector(SIGNIN_BTN);
  await page.waitForSelector('#SignInModule');
  await page.click(EMAIL_SELECTOR);
  await page.keyboard.type(CREDS.email);
  await page.click(PW_SELECTOR);
  await page.keyboard.type(CREDS.password);
  await page.click(SIGNIN_BTN);
  await page.waitForNavigation();

  const SEARCH_QUERY = 'developer';
  const URL = `https://www.glassdoor.com/Job/jobs.htm?clickSource=searchBtn&typedKeyword=${SEARCH_QUERY}&sc.keyword=${SEARCH_QUERY}`;
  
  await page.goto(URL);

  const EASYAPPLYJOBS = [];

  // const EASYAPPLYJOBS = await page.evaluate(() => {
  //   // put all li elements containing job results into an array
  //   const jobListElems = Array.from(document.getElementsByClassName('jl'));

  //   // filter the li elements so that the array will only contain those with a div that indicates easy apply is available (one click apply - through glassdoor and not external site)
  //   const filtJobLinks = jobListElems.filter(node => {
  //     let div = node.childNodes[1].childNodes[1].childNodes[1];
  //     return (div !== undefined) ? div.getAttribute('class') === 'alignRt' : false
  //   });

  //   // retrieve only the links from the href attributes in li elements
  //   const links = filtJobLinks.map((node) => {
  //     return node.childNodes[1].childNodes[0].childNodes[0].childNodes[0].href;
  //   });
  //   console.log(window.location.href);
  //   return links;
  // });
  // console.log(EASYAPPLYJOBS);

  /* * * * * 
      Navigates to every pagination page in results and collects the links to the job listings that can be applied to using 'Easy Apply' and puts then into an array
    * * * * */
  const NEXT_PAGE_SELECTOR = 'li.next';
  let nextExists = true;
  let count = 0;
  while (count < 20) {
    /* * * * * 
      check if module pops up and close -- GlassDoor has an module that pops up each time a pagination page is navigated to
    * * * * */
    // waiting for module to load
    await page.waitFor(1000);
    const clExists = await page.evaluate(() => {
      return document.getElementsByClassName('mfp-close').length !== 0;
    });
    
    if (clExists) {
      await page.click('.mfp-close');
    }

    /* * * * * 
      -> iterating through all li elements that contain the job listings and checking if they contain the easy apply element indicating that the job can be applied through GlassDoor's website
      -> then retrieves all href attributes for the links to those listings
    * * * * */
    // const temp = await page.evaluate(() => {
    //   // put all li elements containing job results into an array
    //   const jobListElems = Array.from(document.getElementsByClassName('jl'));

    //   // filter the li elements so that the array will only contain those with a div that indicates easy apply is available (one click apply - through glassdoor and not external site)
    //   const filtJobLinks = jobListElems.filter(node => {
    //     let div = node.childNodes[1].childNodes[1].childNodes[1];
    //     return (div !== undefined) ? div.getAttribute('class') === 'alignRt' : false
    //   });

    //   // retrieve only the links from the href attributes in li elements
    //   const links = filtJobLinks.map((node) => {
    //     return node.childNodes[1].childNodes[0].childNodes[0].childNodes[0].href;
    //   });
    //   return links
    // });
    // EASYAPPLYJOBS.push(...temp);

    /* * * * * 
      check if next tab exists - attempt to figure out when the pagination ends but needs modification because next tab always exists --- even when at the last pagination page
    * * * * */
    nextExists = await page.evaluate(() => {
      const arr = Array.from(document.getElementsByClassName('next'));
      return arr[0] !== undefined;
    });
    count++;
    if (nextExists) await page.click(NEXT_PAGE_SELECTOR);
  }
  console.log(EASYAPPLYJOBS);








  // for (let INDEX = 0; INDEX <= 40; INDEX += 10) {
  //   const searchURL = `https://www.indeed.com/jobs?q=developer&l=New+York%2C+NY&start=${INDEX}`;
    
  //   if (INDEX === 0) { // first page 
  //     const searchURL = 'https://www.indeed.com/jobs?q=developer&l=New+York%2C+NY';
  //     await page.goto(searchURL);
  //     await page.reload({ waitUntil: 'load' }); // if use reload MAKE SURE THERE"S NO await page.waitForNavigation();
    
  //   } else {
  //     await page.goto(searchURL)
  //     await page.reload({ waitUntil: 'load' }); 
  //   }
    
  //   const hrefs = await page.evaluate(() => {
  //     const anchors = document.querySelectorAll('a');
  //     return [].map.call(anchors, a => a.href);
  //   });
  //   // console.log(hrefs);

  //   for (let i = 0; i < hrefs.length; i++) {
  //     if (hrefs[i].includes('/company/'))/* || hrefs[i].includes('pagead'))*/ {
  //       EASYAPPLYJOBS.push(hrefs[i]);
  //     }
  //   }
  // }

  // LOOPING THROUGH ^ ARRAY OF GlassDoor JOBS TO APPLY: 
  
  // for(let i = 0; i < EASYAPPLYJOBS.length - 1; i += 1) {
  //   await page.goto(EASYAPPLYJOBS[i]);
    
  //   const APPLY_BTN = '.indeed-apply-button';
  //   await page.click(APPLY_BTN);
  //   await page.waitFor(10 * 1000);

  //   // let APPLY_SUBMIT1 = '#button_content'
  //   let APPLY_SUBMIT2 = '.form-page-next'; //most popular one
  //   await page.click('a[href="#next"]');

  // }


} 

run();

// async function getLinks(page) {


  // return await page.evaluate(() => {
  //   // put all li elements containing job results into an array
  //   const jobListElems = Array.from(document.getElementsByClassName('jl'));

  //   // filter the li elements so that the array will only contain those with a div that indicates easy apply is available (one click apply - through glassdoor and not external site)
  //   const filtJobLinks = jobListElems.filter((node)=> {
  //     let div = node.childNodes[1].childNodes[1].childNodes[1];
  //     return div !== undefined && div.childNodes[0].getAttribute('class') === 'easyApply';
  //   });

  //   // retrieve only the links from the href attributes in li elements
  //   const links = filtJobLinks.map((node) => {
  //     return node.childNodes[1].childNodes[0].childNodes[0].childNodes[0].href;
  //   });
  //   return links;
  // });
// }


// const NEXT_PAGE_SELECTOR = 'li.next';
// const nextExists = true;
// const links = [];
// while (nextExists) {
//   await page.waitForNavigation();
//   console.log('next truthy', nextExists);
//   // getLinks(page).then(result=>{
//   //   console.log('result', result);
//   // });


//   await page.evaluate(() => {
//     // put all li elements containing job results into an array
//     const jobListElems = Array.from(document.getElementsByClassName('jl'));

//     // filter the li elements so that the array will only contain those with a div that indicates easy apply is available (one click apply - through glassdoor and not external site)
//     const filtJobLinks = jobListElems.filter((node)=> {
//       let div = node.childNodes[1].childNodes[1].childNodes[1];
//       return div !== undefined && div.childNodes[0].getAttribute('class') === 'easyApply';
//     });

//     // retrieve only the links from the href attributes in li elements
//     filtJobLinks.map((node) => {
//       links.push(node.childNodes[1].childNodes[0].childNodes[0].childNodes[0].href);
//     });

//   });

//   //console.log(links);

//   nextExists = await page.evaluate(() => {
//     const arr = Array.from(document.getElementsByClassName('next'));
//     return arr[0] !== undefined;
//   });
//   if (nextExists) await page.click(NEXT_PAGE_SELECTOR);
// }
// console.log('allLinks', links);