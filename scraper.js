const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const util = require('util');

// const moongoose = require('mongoose');
// const User = require('./models/user'); 

async function run() {
  // instantiating a browser - with property headless: false (so we can see it working)
  // By default, it is true. 
  const browser = await puppeteer.launch();

  // now we need to instantiate a new page 
  const page = await browser.newPage();

  page.setViewport({
    width: 1366,
    height: 768
  });

  await page.goto('https://www.glassdoor.com/').catch(err => console.log(err));

  // Signing in: 
  // setting sign-in link string id to a variable
  const SIGNIN_SELECTOR = '.sign-in';
  await page.click(SIGNIN_SELECTOR).catch(err => console.log(err));

  const EMAIL_SELECTOR = '#signInUsername';
  const PW_SELECTOR = '#signInPassword';
  const SIGNIN_BTN = '#signInBtn';
  /* * * * * 
    wait for all selectors and btn to be on page
  * * * * */
  await page.waitForSelector(EMAIL_SELECTOR).catch(err => console.log(err));
  await page.waitForSelector(PW_SELECTOR).catch(err => console.log(err));
  await page.waitForSelector(SIGNIN_BTN).catch(err => console.log(err));
  await page.waitForSelector('#SignInModule');
  await page.click(EMAIL_SELECTOR).catch(err => console.log(err));
  await page.keyboard.type(CREDS.email).catch(err => console.log(err));
  await page.click(PW_SELECTOR).catch(err => console.log(err));
  await page.keyboard.type(CREDS.password).catch(err => console.log(err));
  
  await page.click(SIGNIN_BTN).catch(err => console.log(err));

  await page.waitForNavigation().catch(err => console.log(err));

  const SEARCH_QUERY = 'java developer';
  const URL = `https://www.glassdoor.com/Job/jobs.htm?clickSource=searchBtn&typedKeyword=${SEARCH_QUERY}&sc.keyword=${SEARCH_QUERY}`;
  
  await page.goto(URL).catch(err => console.log(err));

  const EASYAPPLYJOBS = [];

  /* * * * * 
      Navigates to every pagination page in results and collects the links to the job listings that can be applied to using 'Easy Apply' and puts then into an array
    * * * * */
  const NEXT_PAGE_SELECTOR = 'li.next';
  let nextExists = true;
  let count = 0;
  while (count < 1) {
    /* * * * * 
      check if module pops up and close -- GlassDoor has an module that pops up each time a pagination page is navigated to
    * * * * */
    // waiting for module to load
    await page.waitFor(3000).catch(err => console.log(err));
    const clExists = await page.evaluate(() => {
      return document.getElementsByClassName('mfp-close').length !== 0;
    }).catch(err => console.log(err));
    
    if (clExists) {
      await page.click('.mfp-close').catch(err => console.log(err));
    }

    /* * * * * 
      -> iterating through all li elements that contain the job listings and checking if they contain the easy apply element indicating that the job can be applied through GlassDoor's website
      -> then retrieves all href attributes for the links to those listings
    * * * * */
    const temp = await page.evaluate(() => {

      // put all li elements containing job results into an array
      const jobListElems = Array.from(document.getElementsByClassName('jl'));

      // filter the li elements so that the array will only contain those with a div that indicates easy apply is available (one click apply - through glassdoor and not external site)
      const filtJobLinks = jobListElems.filter(node => {
        let div = node.childNodes[1].childNodes[1].childNodes[1];
        return (div !== undefined) ? div.getAttribute('class') === 'alignRt' : false
      });

      // retrieve only the links from the href attributes in li elements
      const onePageJobArr = filtJobLinks.map((node) => {
        const jobObj = {};

        // default value 
        jobObj.applied = false;

        // data-id attribute on li element on glassdoor's website
        jobObj.dataId = node.getAttribute('data-id');

        // data-emp-id attribute on li element on glassdoor's website
        jobObj.dataEmpId = node.getAttribute('data-emp-id');

        // job title
        jobObj.title = node.childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerHTML;

        // company name
        jobObj.company = node.childNodes[1].childNodes[1].childNodes[0].innerHTML;

        // link to application
        jobObj.link = node.childNodes[1].childNodes[0].childNodes[0].childNodes[0].href;

        return jobObj;
      });
      
      return onePageJobArr;
    }).catch(err => console.log(err));

    EASYAPPLYJOBS.push(...temp);

    /* * * * * 
      check if next tab exists - attempt to figure out when the pagination ends but needs modification because next tab always exists --- even when at the last pagination page
    * * * * */
    nextExists = await page.evaluate(() => {
      const arr = Array.from(document.getElementsByClassName('next'));
      return arr[0] !== undefined;
    }).catch(err => console.log(err));
    count++;
    if (nextExists) await page.click(NEXT_PAGE_SELECTOR).catch(err => console.log(err));
  }

  /* * * * * 
    Looping through all of the links in the array and applying to those jobs
  * * * * */
  for(let i = 0; i < EASYAPPLYJOBS.length - 1; i += 1) {
    

    /* * * * * 
      -> Go to the page
      -> Check for module
      -> Click the apply button
      -> Input applicant's name
      -> Select Resume
      -> Sumbit
    * * * * */
    console.log('Going to apply page');
    await page.goto(EASYAPPLYJOBS[i].link).catch(err => console.log(err));

    /* * * * * 
      Sometimes GlassDoor has a random module pop up with information, so this will allow us to close that module
    * * * * */
    console.log('Checking for module');
    await page.waitFor(3000).catch(err => console.log(err));
    const clExists = await page.evaluate(() => {
      return document.getElementsByClassName('mfp-close').length !== 0;
    }).catch(err => console.log(err));
    
    if (clExists) {
      await page.click('.mfp-close').catch(err => console.log(err));
    }

    // click to apply
    console.log('Clicking apply btn');
    const APPLY_BTN = '.ezApplyBtn';
    await page.click(APPLY_BTN).catch(err => console.log(err));
    await page.waitForNavigation();

    // fill in user's name
    const INPUT_NAME = '#ApplicantName';
    await page.click(INPUT_NAME).catch(err => console.log(err));

    // clear form inputs
    await page.keyboard.down('Shift').catch(err => console.log(err));
    for (let i = 0; i < 50; i++)
      await page.keyboard.press('ArrowLeft').catch(err => console.log(err));
    await page.keyboard.up('Shift').catch(err => console.log(err));
    
    await page.keyboard.press('Backspace').catch(err => console.log(err));

    await page.keyboard.type(CREDS.name).catch(err => console.log(err));

    // select resume
    await page.select('select#ExistingResume', 'Resume.pdf').catch(err => console.log(err));
    
    // SUBMIT!
    console.log('Submitting');
    const SUMBIT_BTN = '#SubmitBtn';
    await page.click(SUMBIT_BTN).catch(err => console.log(err));
    await page.waitFor(5000).catch(err => console.log(err));
    
    let succExists = false;
    succExists = await page.evaluate(() => {
      const yo = document.getElementsByClassName('successBox').length !== 0;
      console.log(yo);
      return yo;
    }).catch(err => console.log(err));

    if (succExists) EASYAPPLYJOBS[i].applied = true;
    else EASYAPPLYJOBS[i].applied = false;
  };
  console.log(EASYAPPLYJOBS);

  browser.close();

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