const dotenv = require('dotenv');
const {chromium} = require('playwright');

const getUsernames = require('./test');

dotenv.config();

// Read user properties from env
const { USER_IDENTIFIER, USER_PASS, POST_URL } = process.env;

const LOGIN_URL = 'https://www.instagram.com/'

const SECONDS = {
    ONE: 1000,
    TWO: 2000,
    FIVE: 5000,
    TEN: 10000,
    FIFTEEN: 15000,
    THIRTY: 30000,
    SIXTY: 60000
};

console.log(getUsernames());

(
    async () => {
        const browser = await chromium.launch({
            headless: false,
            executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe'
        })
        const page = await browser.newPage();
        await page.goto(LOGIN_URL);
        await inputCredentials({username: USER_IDENTIFIER, password: USER_PASS, page})
        await sleep(SECONDS.TEN);
        
        // Go to post
        await page.goto(POST_URL);
        
        // Add comment
        await sendComments({userNames: getUsernames().slice(3), page})

        // await addComment({text: "Hi there!", page})
        await page.screenshot({path: './demo.png'})

        await browser.close()
    }
)()


const sendComments = async ({userNames, page}) => {
    for (const userName of userNames) {
        await addComment({text: userName, page});
        await sleep(SECONDS.FIVE);
        await page.reload();
        await sleep(SECONDS.FIVE);
    }
}

const addComment = async ({text, page}) => {
    // Get textarea and then add required text
    await page.locator('textarea').fill(text)
    await page.keyboard.press('Enter')
}

const inputCredentials = async ({username, password, page}) => {
    await fillUserName(page, username)
    await fillPassword(page, password)
    await clickOnLogin(page)
}

const clickOnLogin = async (page) => {
    let buttons = await page.locator('button:has-text("Iniciar sesión")')
    let element = await buttons.nth(0);
    await element.click()
}

const fillUserName = async (page, username) => {
    await page.getByLabel("Teléfono, usuario o correo electrónico").fill(username)
}

const fillPassword = async (page, password) => {
    await page.getByLabel("Contraseña").fill(password)
}

const sleep = async (time) => {
    console.log(`Sleeping process for ${time/1000} seconds`);
    await new Promise((resolve, reject) => {
        setTimeout(() => resolve(console.log("Now awake!")), time)
    })
}