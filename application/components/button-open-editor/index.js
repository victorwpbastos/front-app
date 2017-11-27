let fs = require('fs');
let path = require('path');
let os = require('os');
let { spawn } = require('child_process');
let { shell } = require('electron');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

module.exports = {
	template: template,

	props: {
		path: { required: true }
	},

	methods: {
		run() {
			let command = os.platform() === 'win32' ? 'code.cmd' : 'code';

			let child = spawn(command, ['.'], { cwd: this.path, stdin: 'inherit' });

			child.on('error', () => shell.openExternal(this.path));
		}
	}
};