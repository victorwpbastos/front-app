let fs = require('fs');
let path = require('path');
let { dialog } = require('electron').remote;
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

module.exports = {
	template: template,

	data() {
		return {
			config: Object.assign({}, this.$store.config),

			errorMessage: '',
			successMessage: '',
			loading: false
		};
	},

	computed: {
		canConfirm() {
			let additionalTemplates = this.config.additionalTemplates;
			let invalids = 0;

			additionalTemplates.forEach(at => {
				if (at.full_name === '' && at.description === '') {
					return;
				}

				if (at.full_name === '' || at.description === '') {
					invalids++;
				}

				if (!this.isValidURL(at.full_name)) {
					invalids++;
				}
			});

			return invalids === 0;
		}
	},

	watch: {
		'config.additionalTemplates': {
			handler() {
				if (this.config.additionalTemplates.length === 0) {
					this.config.additionalTemplates.push({ description: '', full_name: '' });
				}
			},

			immediate: true
		}
	},

	methods: {
		showFileDialog() {
			dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Executables', extensions: ['exe', 'cmd'] }] }, (paths) => {
				if (paths) {
					this.config.editor = paths[0];
				}
			});
		},

		isValidURL(url) {
			let re = /^.+\/.+$/i;

			if (url) {
				return re.test(url);
			} else {
				return true;
			}
		},

		confirm() {
			this.$store.config = this.config;

			this.successMessage = 'Preferences saved successfully!';

			setTimeout(() => {
				this.successMessage = '';
			}, 5000);
		}
	}
};