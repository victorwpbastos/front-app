let { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron');
let kill = require('tree-kill');
let splashWindow = null;
let mainWindow = null;
let tray = null;
let contextMenu = null;
let showTrayBalloon = true;
let frontStartPid = null;
let frontBuildPid = null;

app.on('ready', () => {
	splashWindow = new BrowserWindow({
		width: 400,
		height: 150,
		frame: false,
		alwaysOnTop: true,
		show: false
	});

	mainWindow = new BrowserWindow({
		width: 800,
		minWidth: 800,
		height: 600,
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

ipcMain.on('front-start-pid', (e, pid) => {
	frontStartPid = pid;
});

ipcMain.on('front-build-pid', (e, pid) => {
	frontBuildPid = pid;
});

app.on('before-quit', (e) => {
	e.preventDefault();

	if (frontStartPid) {
		kill(frontStartPid, () => app.exit());
	} else if(frontBuildPid) {
		kill(frontBuildPid, () => app.exit());
	} else {
		app.exit();
	}
});