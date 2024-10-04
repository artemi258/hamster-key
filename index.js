const puppeteer = require('puppeteer');
const { KnownDevices } = require('puppeteer');

const Pixel = KnownDevices['Pixel 5'];

const URL =
	'https://tg-app.memefi.club/#tgWebAppData=query_id%3DAAGNFj1vAAAAAI0WPW-YoW6T%26user%3D%257B%2522id%2522%253A1866274445%252C%2522first_name%2522%253A%2522%25D0%2590%25D1%2580%25D1%2582%25D0%25B5%25D0%25BC%25D0%25B8%25D0%25B9%25F0%259F%2590%2588%25E2%2580%258D%25E2%25AC%259B%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ArtemiiGrebnev%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D1727790682%26hash%3D7602291a7a232470c45244ce964d2a7a48b070f75e5a95b4a3ccca8458edc588&tgWebAppVersion=7.10&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D'.replace(
		/=web/,
		'=android'
	);

const startFarmDogiators = async () => {
	const option = { headless: false };

	const browser = await puppeteer.launch(option);

	const page = await browser.newPage();

	await page.emulate(Pixel).catch(() => console.log('ошибка эмуляции'));
	await page
		.goto(URL, { waitUntil: 'load' })
		.catch(() => console.log('ошибка перехода на страницу'));

	await page.waitForSelector('.css-1t9owpd', { visible: true });
	await page.$eval('.css-1t9owpd', (btn) => btn.click());
	await page.waitForSelector('.css-73lj20', { visible: true });
	await page.$eval('.css-73lj20', (btn) => btn.click());
	await page.waitForSelector('.css-1ru9rcs', { visible: true });
	await page.$eval('.css-1ru9rcs', (btn) => btn.click());

	const generateCoordinates = (figureData) => {
		const maxWidth = figureData.width;
		const maxHeight = figureData.height;
		const minWidth = figureData.width / 3;
		const minHeight = figureData.height / 3;
		const coordinatesForClickX = Math.round(
			Math.random() * (maxWidth - minWidth - minWidth) + minWidth
		);
		const coordinatesForClickY = Math.round(
			Math.random() * (maxHeight - minHeight - minHeight) + minHeight
		);
		return {
			coordinatesX: coordinatesForClickX,
			coordinatesY: coordinatesForClickY,
		};
	};
	const startFarm = async () => {
		let launchedClick = true;
		await page.waitForSelector('[role="figure"]');
		const figure = await page.$('[role="figure"]');
		const figureData = await figure.boundingBox();

		const click = async () => {
			const existImgTurbo = await page.$('[alt="turbo"]');
			console.log(existImgTurbo);
			if (launchedClick && !existImgTurbo) {
				const intervalClickRandom = Math.round(Math.random() * (200 - 100) + 100);

				setTimeout(() => {
					const { coordinatesX, coordinatesY } = generateCoordinates(figureData);
					console.log(`X${coordinatesX} Y${coordinatesY}`);
					figure.click({ offset: { x: coordinatesX, y: coordinatesY } });

					click();
				}, intervalClickRandom);
			} else if (launchedClick && existImgTurbo) {
				click();
			} else {
				setTimeout(launchTurbo, 2000);
			}
		};

		click();

		setTimeout(() => {
			launchedClick = false;
		}, 11000);
	};

	const launchTurbo = async () => {
		await page.waitForSelector('.css-1vfl7gr', {
			visible: true,
		});

		const boosts = await page.$$('.css-1vfl7gr', { visible: true });

		await page.waitForFunction(() => new Promise((res, _rej) => setTimeout(() => res('ok'), 5000)));

		await boosts[0].click();

		await page.waitForSelector('.MuiBox-root.css-108biwi', { visible: true });

		const turbo = await page.$$('.MuiBox-root.css-108biwi button');

		await page.waitForFunction(() => new Promise((res, _rej) => setTimeout(() => res('ok'), 3000)));

		await turbo[0].click();

		const btn = await page.$('.MuiBox-root.css-4q3rnc button');

		await page.waitForFunction(() => new Promise((res, _rej) => setTimeout(() => res('ok'), 3000)));

		await btn.click();

		await page.waitForSelector('[alt="turbo"]', { visible: true });

		const imgTurbo = await page.$('[alt="turbo"]');

		await page.waitForFunction(() => new Promise((res, _rej) => setTimeout(() => res('ok'), 3000)));

		await imgTurbo.click();

		startFarm();
	};
	launchTurbo();
};

startFarmDogiators();
