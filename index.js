const puppeteer = require('puppeteer');
const { KnownDevices } = require('puppeteer');
const { Logger } = require('tslog');

const Pixel = KnownDevices['Pixel 5'];

const logger = new Logger({
	prettyLogTemplate: '{{dd}}-{{mm}}-{{yyyy}} {{hh}}:{{MM}}:{{ss}} {{logLevelName}} ',
	prettyLogTimeZone: 'local',
	hideLogPositionForProduction: true,
});

const URL =
	'https://tg-app.memefi.club/#tgWebAppData=query_id%3DAAGNFj1vAAAAAI0WPW-YoW6T%26user%3D%257B%2522id%2522%253A1866274445%252C%2522first_name%2522%253A%2522%25D0%2590%25D1%2580%25D1%2582%25D0%25B5%25D0%25BC%25D0%25B8%25D0%25B9%25F0%259F%2590%2588%25E2%2580%258D%25E2%25AC%259B%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522ArtemiiGrebnev%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%257D%26auth_date%3D1727790682%26hash%3D7602291a7a232470c45244ce964d2a7a48b070f75e5a95b4a3ccca8458edc588&tgWebAppVersion=7.10&tgWebAppPlatform=web&tgWebAppThemeParams=%7B%22bg_color%22%3A%22%23212121%22%2C%22button_color%22%3A%22%238774e1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22hint_color%22%3A%22%23aaaaaa%22%2C%22link_color%22%3A%22%238774e1%22%2C%22secondary_bg_color%22%3A%22%23181818%22%2C%22text_color%22%3A%22%23ffffff%22%2C%22header_bg_color%22%3A%22%23212121%22%2C%22accent_text_color%22%3A%22%238774e1%22%2C%22section_bg_color%22%3A%22%23212121%22%2C%22section_header_text_color%22%3A%22%238774e1%22%2C%22subtitle_text_color%22%3A%22%23aaaaaa%22%2C%22destructive_text_color%22%3A%22%23ff595a%22%7D'.replace(
		/=web/,
		'=android'
	);

const startFarmDogiators = async () => {
	logger.info('запускаем фарм бустов');

	const option = { headless: false };

	const browser = await puppeteer.launch(option);

	const page = await browser.newPage();

	await page.emulate(Pixel).catch(() => logger.fatal('ошибка эмуляции'));
	await page
		.goto(URL, { waitUntil: ['load'] })
		.catch(() => logger.fatal('ошибка перехода на страницу'));

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
	const startFarm = async (figure, figureData) => {
		let launchedClick = true;

		const click = async () => {
			const existImgTurbo = await page.$('[alt="turbo"]');
			if (launchedClick && !existImgTurbo) {
				const intervalClickRandom = Math.round(Math.random() * (150 - 100) + 100);

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
		}, 12000);
	};

	const launchTurbo = async () => {
		try {
			await page.waitForSelector('.css-1vfl7gr', {
				visible: true,
			});
			const boosts = await page.$$('.css-1vfl7gr', { visible: true });
			await page.waitForFunction(
				() => new Promise((res, _rej) => setTimeout(() => res('ok'), 5000))
			);
			await boosts[0].click();
			await page.waitForSelector('.MuiBox-root.css-108biwi', { visible: true });
			const turbo = await page.$$('.MuiBox-root.css-108biwi button');
			await page.waitForFunction(
				() => new Promise((res, _rej) => setTimeout(() => res('ok'), 3000))
			);
			await turbo[0].click();
			const btn = await page.$('.MuiBox-root.css-4q3rnc button');
			await page.waitForFunction(
				() => new Promise((res, _rej) => setTimeout(() => res('ok'), 3000))
			);
			await btn.click();
			await page.waitForSelector('[alt="turbo"]', { visible: true });
			const imgTurbo = await page.$('[alt="turbo"]');
			await page.waitForFunction(
				() => new Promise((res, _rej) => setTimeout(() => res('ok'), 3000))
			);

			await page.waitForSelector('[role="figure"]');
			const figure = await page.$('[role="figure"]');
			const figureData = await figure.boundingBox();

			await imgTurbo.click();

			// const existRateLimit = page.locator('.css-1sta78r');
			// logger.info(existRateLimit);
			// if (existRateLimit) throw new Error('Rate limit');

			startFarm(figure, figureData);
		} catch (error) {
			logger.error(error);
		}
	};
	launchTurbo();
};

startFarmDogiators();
{
	/* <div class="css-1sta78r" style="opacity: 1; transform: translateX(0px);">
	<div class="css-1i0mfwu">
		<div class="css-hp68mp">
			<div class="MuiBox-root css-1thj5b7">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g clip-path="url(#clip0_10302_247434)">
						<path
							d="M4.51007 22.9986V9.00138L16.7578 2L29 9.00138V22.9986L16.7578 29.9945L4.51007 22.9986Z"
							fill="#F23C3C"
						></path>
						<path
							d="M8.33261 11.1862V20.8138L16.7578 25.6303L25.1774 20.8138V11.1862L16.7578 6.36966L8.33261 11.1862Z"
							fill="#F23C3C"
						></path>
						<path
							d="M10.177 21.7076L12.6344 13.4593L17.4933 10.7062L24.9434 11.3738L23.1213 10.0828L21.8731 9.29379L16.7522 6.75586L14.2002 7.81517L13.3755 8.30069L8.33261 11.269L8.46077 20.6041L10.177 21.7076Z"
							fill="#FF5C4D"
						></path>
						<path
							d="M4.51007 9.00138L8.33262 11.1862V20.8138L4.51007 22.9986V9.00138Z"
							fill="url(#paint0_linear_10302_247434)"
						></path>
						<path
							d="M16.7578 6.36966V2L29 9.00138L25.1775 11.1862L16.7578 6.36966Z"
							fill="url(#paint1_linear_10302_247434)"
						></path>
						<path
							d="M16.7578 25.6303V29.9945L4.51007 22.9986L8.33262 20.8138L16.7578 25.6303Z"
							fill="url(#paint2_linear_10302_247434)"
						></path>
						<path
							d="M25.1775 20.8138L29 22.9986L16.7578 29.9945V25.6303L25.1775 20.8138Z"
							fill="#941E1E"
						></path>
						<path
							d="M25.1775 11.1862V20.8138L29 22.9986V9.00138L25.1775 11.1862Z"
							fill="url(#paint3_linear_10302_247434)"
						></path>
						<path
							d="M4.51007 9.00138L7.87569 11.4234L8.09301 20.7035L4.51007 22.9986L8.39391 21.189L12.4115 23.1421L8.46078 20.6041L8.33262 11.269L13.3755 8.30069L7.95371 10.9434L4.51007 9.00138Z"
							fill="#FFC0B3"
						></path>
						<path
							d="M14.0386 7.92L16.7522 6.75586L21.8731 9.29379L17.0699 6.36966L16.7578 3.3131L16.4068 6.36966L14.0386 7.92Z"
							fill="#FFC0B3"
						></path>
						<path
							d="M23.1993 10.0552L24.9434 11.3738L25.1774 15.5172L25.4338 11.3352L27.3562 9.93931L25.1774 10.971L23.1993 10.0552Z"
							fill="#FFC0B3"
						></path>
						<path
							d="M16.7578 29.6966L17.2203 25.9283L25.0214 21.3269L27.88 22.3586L25.3056 20.9021L25.1775 17.851L24.7763 20.9517L16.9584 25.509L13.1414 23.5614L16.6464 25.829L16.7578 29.6966Z"
							fill="#FFC0B3"
						></path>
						<path
							d="M13.1414 4.06897L14.2002 7.81517L13.3755 8.30069L9.45821 10.2097L8.75053 6.57379L13.1414 4.06897Z"
							fill="#FF7366"
						></path>
						<path
							d="M23.1993 19.0483C23.021 19.1531 20.3742 21.9614 20.3742 21.9614L16.8358 18.1766L13.7154 22.0386L10.8011 19.6552L14.3562 15.9917L10.5225 12.8359L13.5204 9.98345L16.7244 13.6634L20.168 9.93931L22.904 12.3779L19.4826 15.6883L23.1993 19.0483Z"
							fill="#A61919"
						></path>
						<path
							d="M23.6952 13.8455L21.7171 15.5172L23.6952 17.4483V13.8455Z"
							fill="#FF5C4D"
						></path>
						<path
							d="M17.1646 20.091L19.1093 22.469L16.7913 24.7255L15.0193 22.8497L17.1646 20.091Z"
							fill="#FF5C4D"
						></path>
						<path
							d="M11.1856 13.3766L13.4424 11.1862L16.6408 14.629L20.3965 10.8993L22.3301 12.9352L22.904 12.3779L20.168 9.93931L16.73 13.6634L13.5204 9.98345L10.5225 12.8359L11.1856 13.3766Z"
							fill="#801313"
						></path>
						<path
							d="M14.345 15.9752V16.891L11.3472 20.091L10.7788 19.6386L14.345 15.9752Z"
							fill="#801313"
						></path>
						<path
							d="M19.4826 15.7103V16.6317L22.5306 19.7048L23.1993 19.0483L19.4826 15.7103Z"
							fill="#801313"
						></path>
						<path
							d="M10.7788 19.6386L13.7154 22.011L16.8358 18.1766L20.3742 21.9614L23.1993 19.0483L20.5079 22.469L16.8581 18.7559L13.799 22.469L10.7788 19.6386Z"
							fill="#FFC0B3"
						></path>
						<path
							opacity="0.5"
							d="M8.18774 16.24C11.0529 16.24 13.3755 13.9403 13.3755 11.1034C13.3755 8.26661 11.0529 5.9669 8.18774 5.9669C5.32263 5.9669 3 8.26661 3 11.1034C3 13.9403 5.32263 16.24 8.18774 16.24Z"
							fill="url(#paint4_radial_10302_247434)"
							style="mix-blend-mode: color-dodge;"
						></path>
					</g>
					<defs>
						<linearGradient
							id="paint0_linear_10302_247434"
							x1="6.25418"
							y1="21.1338"
							x2="6.46177"
							y2="13.2937"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#EB2F2F"></stop>
							<stop offset="1" stop-color="#BF2626"></stop>
						</linearGradient>
						<linearGradient
							id="paint1_linear_10302_247434"
							x1="24.7428"
							y1="8.97379"
							x2="19.3951"
							y2="5.21094"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#EB2F2F"></stop>
							<stop offset="1" stop-color="#BF2626"></stop>
						</linearGradient>
						<linearGradient
							id="paint2_linear_10302_247434"
							x1="15.1419"
							y1="26.9048"
							x2="8.62739"
							y2="23.086"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#D62B2B"></stop>
							<stop offset="1" stop-color="#A61010"></stop>
						</linearGradient>
						<linearGradient
							id="paint3_linear_10302_247434"
							x1="27.0609"
							y1="20.1517"
							x2="27.1319"
							y2="12.1352"
							gradientUnits="userSpaceOnUse"
						>
							<stop stop-color="#D62B2B"></stop>
							<stop offset="1" stop-color="#A61010"></stop>
						</linearGradient>
						<radialGradient
							id="paint4_radial_10302_247434"
							cx="0"
							cy="0"
							r="1"
							gradientUnits="userSpaceOnUse"
							gradientTransform="translate(8.18774 11.1034) scale(5.18774 5.13655)"
						>
							<stop stop-color="#FFC0B3"></stop>
							<stop offset="0.03" stop-color="#FFC0B3" stop-opacity="0.96"></stop>
							<stop offset="0.24" stop-color="#FFC0B3" stop-opacity="0.67"></stop>
							<stop offset="0.44" stop-color="#FFC0B3" stop-opacity="0.43"></stop>
							<stop offset="0.62" stop-color="#FFC0B3" stop-opacity="0.24"></stop>
							<stop offset="0.78" stop-color="#FFC0B3" stop-opacity="0.11"></stop>
							<stop offset="0.91" stop-color="#FFC0B3" stop-opacity="0.03"></stop>
							<stop offset="1" stop-color="#FFC0B3" stop-opacity="0"></stop>
						</radialGradient>
						<clipPath id="clip0_10302_247434">
							<rect width="26" height="28" fill="white" transform="translate(3 2)"></rect>
						</clipPath>
					</defs>
				</svg>
			</div>
			<span class="MuiTypography-root MuiTypography-bodySmallBold css-sthj7">
				You are rate limited. Please try again later
			</span>
		</div>
		<button class="css-1ru9rcs">
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g id="icn 16-Close">
					<path
						id="Shape"
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M7.99077 9.19191L12.6947 13.8951L13.8967 12.6929L9.20506 8.00204L13.8906 3.41074L12.7008 2.19651L8.00283 6.79999L3.30807 2.10596L2.10608 3.30813L6.78854 7.98986L2.11217 12.5722L3.30198 13.7864L7.99077 9.19191Z"
						fill="#C9B19C"
					></path>
				</g>
			</svg>
		</button>
	</div>
</div>; */
}
