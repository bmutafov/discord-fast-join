// In renderer process (web page).
const { ipcRenderer } = require('electron');

const messageBox = document.getElementById('message-box');
const button = document.getElementById('submit');
const stop = document.getElementById('close');
const clear = document.getElementById('clear');

const email_input = document.getElementById('email');
const password_input = document.getElementById('password');
const server_input = document.getElementById('server');
const channel_input = document.getElementById('channel');
const save_checkbox = document.getElementById('save');
const headless_checkbox = document.getElementById('headless');

ipcRenderer.on('get-user-data-reply', (event, arg) => {
	if (arg) {
		const { email, password, channel, server, headless } = arg;
		email_input.value = email;
		password_input.value = password;
		server_input.value = server;
		channel_input.value = channel;
		save_checkbox.checked = true;
		headless_checkbox.checked = headless;
	}
});

ipcRenderer.on('send-update-message', (event, arg) => {
	addMessage(event, arg);
});

ipcRenderer.send('get-user-data');

button.addEventListener('click', () => {
	const email = email_input.value;
	const password = password_input.value;
	const channel = channel_input.value;
	const server = server_input.value;
	const headless = headless_checkbox.checked;
	ipcRenderer.send('start-listener', {
		email,
		password,
		server,
		channel,
		save_info: save_checkbox.checked,
		headless,
	});
	button.disabled = true;
	stop.disabled = false;
});

stop.addEventListener('click', () => {
	ipcRenderer.send('close-browser');
	button.disabled = false;
	stop.disabled = true;
});

clear.addEventListener('click', () => {
	console.log('h');
	clearConsole();
});

function format(number) {
	return number < 10 ? `0${number}` : `${number}`;
}

function formatdate(date) {
	return `[${date.getHours()}:${format(date.getMinutes())}:${format(
		date.getSeconds()
	)}]`;
}

function addMessage(event, arg) {
	messageBox.innerHTML += `
    <div class="message ${arg.error ? 'error' : ''}">
        <span class="time">${formatdate(arg.date)}</span>
        <span class="text">${arg.message}</span>
    </div>
    `;
}

function clearConsole() {
	console.log('clear');
	messageBox.innerHTML = '';
	addMessage(null, {
		error: true,
		date: new Date(),
		message: 'Console cleared',
	});
}
