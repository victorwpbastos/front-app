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
		getPersistedConfig() {
			let configFile = path.resolve(os.homedir(), '.front-app/config.json');

			try {
				return require(configFile);
			} catch (error) {
				return '';
			}
		},

		run() {
			let config = this.getPersistedConfig();
			let child = spawn(config.editor, ['.'], { cwd: this.path, stdin: 'inherit' });

			child.on('error', () => shell.openExternal(this.path));
		}
	}
};