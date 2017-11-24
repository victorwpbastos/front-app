let fs = require('fs');
let path = require('path');
let { dialog } = require('electron').remote;
let { spawn } = require('child_process');
let os = require('os');
let request = require('request');
let template = fs.readFileSync(path.resolve(__dirname, 'init.html'), 'utf8');

module.exports = {
	template: template,

	data() {
		return {
			path: '',
			name: '',
			template: '',
			templates: [],

			loading: false
		};
	},

	computed: {
		fullPath() {
			if (this.path && this.name) {
				return `${this.path}${path.sep}${this.name}`;
			} else {
				return this.path;
			}
		}
	},

	created() {
		this.populateTemplates();
	},

	methods: {
		populateTemplates() {
			let url = 'https://api.github.com/users/front-templates/repos';
			let headers = { 'User-Agent': 'front-cli' };
			let qs = { 'order': 'created', 'direction': 'desc' };

			request({ url, headers, qs }, (error, response, data) => {
				if (error) {
					console.error(error);
				} else {
					this.templates = JSON.parse(data);
				}
			});
		},

		showFileDialog() {
			dialog.showOpenDialog({ properties: ['openDirectory'] }, (folders) => {
				this.path = folders ? folders[0] : '';
			});
		},

		confirm() {
			try {
				let command = os.platform() === 'win32' ? 'front.cmd' : 'front';
				// let child = spawn(command, ['init', '--template', this.template], { cwd: this.fullPath });
				let child = spawn(command, ['init', this.name, '--template', this.template], { cwd: this.path });

				this.loading = true;

				child.stdout.on('data', (data) => {
					if (data && data.toString().length > 1) {
						// this.loading = false;
						// this.output += convert.toHtml(data.toString());
						// console.log(data.toString());
						console.log('data');
					}
				});

				child.stderr.on('data', (data) => {
					this.loading = false;
					console.log(data.toString());
				});

				child.on('close', () => {
					console.log('close');
					// this.isRunning = false;

					// this.output = '';
					// this.showOutput = false;
					// this.address = '';
				});
			} catch (error) {
				console.log(error);
			}
		}
	}
};