// let menubar = require('menubar');

// let mb = menubar({ icon: 'assets/img/logo.png' });

// mb.on('after-create-window', () => {
// 	mb.window.setSkipTaskbar(true);
// 	mb.window.openDevTools();
// });

// mb.on('ready', () => {
// 	console.log('ready');
// });


let { app, BrowserWindow } = require('electron');

app.on('ready', () => {
	let splash = new BrowserWindow({
		width: 400,
		height: 150,
		frame: false,
		alwaysOnTop: true
	});
	let win = new BrowserWindow({
		minWidth: 890,
		minHeight: 600,
		show: false
		// frame: false,
		// skipTaskbar: true
	});

	// win.setMenu(null);

	splash.loadURL(`file://${__dirname}/splash.html`);

	win.loadURL(`file://${__dirname}/index.html`);

	win.once('ready-to-show', () => {
		splash.destroy();
		win.show();
		win.webContents.openDevTools();
	});
});


// let path = require('path')
// let url = require('url')

// let tray = null;

// function createWindow() {
// 	let win = new BrowserWindow({
// 		width: 200,
// 		height: 300,
// 		frame: false,
// 		show: false,
// 		skipTaskbar: true
// 	});

// 	win.loadURL(url.format({
// 		pathname: path.join(__dirname, 'index.html'),
// 		protocol: 'file:',
// 		slashes: true
// 	}));

// 	return win;
// }

// app.on('ready', () => {
// 	let contextMenu = Menu.buildFromTemplate([
// 		{ label: 'Item 1', type: 'radio' },
// 		{ label: 'Item 2', type: 'radio' },
// 		{ label: 'Item 3', type: 'radio' }
// 	]);
// 	let win = createWindow();

// 	tray = new Tray('logo.png');

// 	tray.setToolTip('Front App');
// 	tray.setContextMenu(contextMenu);

// 	// win.setBounds(tray.getBounds());

// 	tray.on('click', (e, bounds) => {
// 		console.log(bounds);
// 		// win.setPosition( (bounds.x * 2), (bounds.y * 2) );
// 		win.setPosition(bounds.x, 200);
// 		win.isVisible() ? win.hide() : win.show();
// 	});

// 	tray.on('double-click', (bounds) => {
// 		app.quit();
// 	});

// 	// win.on('show', () => {
// 	// 	tray.setHighlightMode('always')
// 	// });

// 	// win.on('hide', () => {
// 	// 	tray.setHighlightMode('never')
// 	// });
// });




// const electron = require('electron')
// // Module to control application life.
// const app = electron.app
// // Module to create native browser window.
// const BrowserWindow = electron.BrowserWindow

// const path = require('path')
// const url = require('url')

// // Keep a global reference of the window object, if you don't, the window will
// // be closed automatically when the JavaScript object is garbage collected.
// let mainWindow

// function createWindow () {
//   // Create the browser window.
//   mainWindow = new BrowserWindow({width: 800, height: 600})

//   // and load the index.html of the app.
//   mainWindow.loadURL(url.format({
//     pathname: path.join(__dirname, 'index.html'),
//     protocol: 'file:',
//     slashes: true
//   }))

//   // Open the DevTools.
//   // mainWindow.webContents.openDevTools()

//   // Emitted when the window is closed.
//   mainWindow.on('closed', function () {
//     // Dereference the window object, usually you would store windows
//     // in an array if your app supports multi windows, this is the time
//     // when you should delete the corresponding element.
//     mainWindow = null
//   })
// }

// // This method will be called when Electron has finished
// // initialization and is ready to create browser windows.
// // Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// // Quit when all windows are closed.
// app.on('window-all-closed', function () {
//   // On OS X it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.
