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
			let command = os.platform() === 'win32' ? 'front.cmd' : 'front';
			let child = spawn(command, ['init', this.name, '--template', this.template], { cwd: this.path });

			this.loading = true;

			child.on('error', (error) => {
				this.loading = false;

				console.error(data.toString());
			});

			child.on('close', (code) => {
				this.loading = false;

				if (code === 0) {
					this.$emit('success', { name: this.name, path: this.fullPath });
				}
			});
		}
	}
};