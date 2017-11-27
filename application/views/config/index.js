let fs = require('fs');
let path = require('path');
let os = require('os');
let { dialog } = require('electron').remote;
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

module.exports = {
	template: template,

	data() {
		return {
			config: {
				editor: '',
				additionalTemplates: []
			},

			loading: false
		};
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

	created() {
		this.config = this.getPersistedConfig();
	},

	methods: {
		getPersistedConfig() {
			let configFile = path.resolve(os.homedir(), '.front-app/config.json');

			try {
				return require(configFile);
			} catch (error) {
				return this.config;
			}
		},

		showFileDialog() {
			dialog.showOpenDialog({ properties: ['openFile'] }, (paths) => {
				this.config.editor = paths ? paths[0] : '';
			});
		},

		persistChanges() {
			let configFolder = path.resolve(os.homedir(), '.front-app');
			let data = JSON.stringify(this.config);

			try {
				fs.mkdirSync(configFolder);
			} catch (error) { }

			fs.writeFileSync(path.resolve(configFolder, 'config.json'), data, 'utf8');

			this.$emit('close');
		}
	}
};