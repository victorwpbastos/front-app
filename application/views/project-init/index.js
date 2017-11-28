let fs = require('fs');
let path = require('path');
let { dialog } = require('electron').remote;
let { spawn } = require('child_process');
let os = require('os');
let request = require('request');
let kill = require('tree-kill');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

module.exports = {
	template: template,

	data() {
		return {
			path: '',
			name: '',
			template: '',
			templates: [],
			child: '',

			successMessage: '',
			errorMessage: '',
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

	beforeDestroy() {
		if (this.child.pid) {
			kill(this.child.pid);
		}

		if (this.fullPath) {
			fs.rmdirSync(this.fullPath);
		}
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

		populateTemplates() {
			let url = 'https://api.github.com/users/front-templates/repos';
			let headers = { 'User-Agent': 'front-cli' };
			let qs = { 'order': 'created', 'direction': 'desc' };
			let config = this.getPersistedConfig();

			if (config && config.additionalTemplates && config.additionalTemplates.length > 0) {
				this.templates.push(...config.additionalTemplates);
			}

			request({ url, headers, qs }, (error, response, data) => {
				if (error) {
					this.errorMessage = 'There was an error while fetching the templates. Try again later.'

					setTimeout(() => {
						this.errorMessage = '';
					}, 5000);
				} else {
					data  = JSON.parse(data);

					this.templates.push(...data);
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

			this.child = spawn(command, ['init', this.name, '--template', this.template], { cwd: this.path });

			this.loading = true;

			this.child.on('error', (data) => {
				this.loading = false;

				console.error(data.toString());
			});

			this.child.on('close', (code) => {
				this.loading = false;

				if (code === 0) {
					this.$store.projects.push({
						_id: new Date().getTime(),
						name: this.name,
						path: this.fullPath
					});

					this.name = '';
					this.path = '';

					this.successMessage = 'Project initialized successfully!';

					setTimeout(() => {
						this.successMessage = '';
					}, 5000);
				}
			});
		}
	}
};