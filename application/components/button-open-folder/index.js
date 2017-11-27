let fs = require('fs');
let path = require('path');
let { shell } = require('electron');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

module.exports = {
	template: template,

	props: {
		path: { required: true }
	},

	methods: {
		run() {
			shell.openExternal(this.path);
		}
	}
};