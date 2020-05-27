const puppeteer = require('puppeteer');
// const config = require('./config.json');
const attachObserver = require('./observer');

/* MAIN EXECUTABLE */
const start = async (config, feedbackMessage) => {
	const { browser, page } = await openBrowserPage(config.headless);
	feedbackMessage('Opened Chrome browser.');

	const args = { browser, page, config, feedbackMessage };

	await goToDiscord(args);

	await login(args);

	await openChannel(args);

	await page.exposeFunction('feedbackMessage', feedbackMessage);
	await page.exposeFunction('attachObserver', attachObserver);
	await page.evaluate(attachObserver, config.server, config.channel);

	return browser;
};

async function openBrowserPage(headless) {
	const browser = await puppeteer.launch({
		headless,
		executablePath:
			'C:/Program Files (x86)/Google/Chrome/Application/Chrome.exe',
	});

	const page = await browser.newPage();

	return { browser, page };
}

async function goToDiscord({ page, feedbackMessage }) {
	await page.goto('https://discord.com/login', {
		waitUntil: 'networkidle0',
	});

	await page.waitForSelector('[name=email]', {
		visible: true,
	});

	feedbackMessage('Loaded http://discrod.com/login.');
}

async function login({ config, page, feedbackMessage }) {
	await page.type('[name=email]', config.email);
	await page.type('[name=password]', config.password);

	await page.click('[type=submit]');

	await page.waitForNavigation({
		waitUntil: 'networkidle0',
	});

	feedbackMessage('Logged in.');
}

async function openChannel({ config, page, feedbackMessage }) {
	await page.goto(config.channel, {
		waitUntil: 'networkidle0',
	});

	await page.waitForSelector('#messages', {
		visible: true,
	});

	feedbackMessage(`Opened channel page.`);
}

module.exports.start = start;
