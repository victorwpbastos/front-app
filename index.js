let { app, BrowserWindow, Menu, Tray } = require('electron');
let splashWindow, mainWindow, tray, contextMenu, showTrayBalloon = true;

app.on('ready', () => {
	splashWindow = new BrowserWindow({
		width: 400,
		height: 150,
		frame: false,
		alwaysOnTop: true,
		show: false
	});

	mainWindow = new BrowserWindow({
		minWidth: 890,
		minHeight: 600,
		icon: `${__dirname}/assets/img/logo.png`,
		show: false
	});

	mainWindow.setMenu(null);

	splashWindow.loadURL(`file://${__dirname}/splash.html`);
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	splashWindow.once('ready-to-show', () => {
		splashWindow.show();
	});

	mainWindow.once('ready-to-show', () => {
		splashWindow.destroy();
		mainWindow.show();
	});

	mainWindow.on('minimize', e => {
		e.preventDefault();
		mainWindow.hide();
	});

	mainWindow.on('close', e => {
		if (!app.isQuiting) {
			e.preventDefault();
			mainWindow.hide();
		}
	});

	mainWindow.on('hide', () => {
		if (!tray && !contextMenu) {
			contextMenu = Menu.buildFromTemplate([
				{
					label: 'Quit',
					type: 'normal',
					click: () => {
						app.isQuiting = true;
						app.quit();
					}
				}
			]);

			tray = new Tray(`${__dirname}/assets/img/logo.png`);

			tray.setToolTip('Front App');
			tray.setContextMenu(contextMenu);

			tray.on('click', () => {
				showTrayBalloon = false;
				mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
			});
		}

		if (showTrayBalloon) {
			tray.displayBalloon({
				icon: `${__dirname}/assets/img/logo.png`,
				title: 'Front App',
				content: 'Front App is still running'
			});
		}
	});
});