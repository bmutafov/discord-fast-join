const { app, BrowserWindow } = require('electron');
// In main process.
const { ipcMain } = require('electron');
const fs = require('fs');
const CONFIG_PATH = './config.json';

function sendUpdate(event, update) {
	const date = new Date();

	// function format(number) {
	// 	return number < 10 ? `0${number}` : `${number}`;
	// }

	// const dateString = `[${date.getHours()}:${format(
	// 	date.getMinutes()
	// )}:${format(date.getSeconds())}]`;
	event.sender.send('send-update-message', {
		date,
		message: update,
	});
}

function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 606,
		height: 443,
		resizable: false,
		webPreferences: {
			nodeIntegration: true,
		},
		title: 'Mr.Beast Discord Server Fast Join',
		icon: __dirname + './img/icon.ico',
	});
	win.setMenu(null);
	// and load the index.html of the app.
	win.loadFile('./appview/index.html');
	// win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('get-user-data', (event, arg) => {
	fs.access(CONFIG_PATH, fs.F_OK, err => {
		if (err) {
			sendUpdate(event, 'No saved file so far, or file corrupted.');
			return;
		}

		const data = JSON.parse(fs.readFileSync(CONFIG_PATH));

		if (data.save_info) {
			const { email, password, channel, server, headless } = data;
			event.sender.send('get-user-data-reply', {
				email,
				password,
				server,
				channel,
				headless,
			});

			sendUpdate(event, 'Using saved user data');
		} else {
			event.sender.send('get-user-data-reply', false);
			sendUpdate(event, 'Started app, waiting for user data');
		}
	});
});

let closeBrowser;
ipcMain.on('start-listener', async (event, args) => {
	if (args.save_info) {
		await fs.promises.writeFile(CONFIG_PATH, JSON.stringify(args, null, 2));
		sendUpdate(event, 'Saved user data.');
	}

	try {
		const discordListner = require('./discord-listener');
		closeBrowser = await discordListner.start(
			args,
			(update, error = false) => sendUpdate(event, update)
		);
	} catch (e) {
		sendUpdate(event, e, true);
	}
});

ipcMain.on('close-browser', (event, args) => {
	try {
		closeBrowser.close();
		sendUpdate(event, 'Closed browser');
	} catch (e) {
		sendUpdate(event, e);
	}
});
