let fs = require('fs');
let path = require('path');
let os = require('os');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
let ProjectList = require('../project-list');
let ProjectAdd = require('../project-add');
let ProjectInit = require('../project-init');
let Config = require('../config');

module.exports = {
	template: template,

	components: { ProjectList, ProjectAdd, ProjectInit, Config },

	data() {
		return {
			activeTab: 1
		};
	},

	watch: {
		'$store.projects'() {
			this.persistProjects();
		},

		'$store.config'() {
			this.persistPreferences();
		}
	},

	methods: {
		changeTab(tabNumber) {
			this.activeTab = tabNumber;
		},

		persistProjects() {
			let configFolder = path.resolve(os.homedir(), '.front-app');
			let data = JSON.stringify(this.$store.projects);

			try {
				fs.mkdirSync(configFolder);
			} catch (error) {}

			fs.writeFileSync(path.resolve(configFolder, 'projects.json'), data, 'utf8');
		},

		persistPreferences() {
			let configFolder = path.resolve(os.homedir(), '.front-app');
			let data = JSON.stringify(this.$store.config);

			try {
				fs.mkdirSync(configFolder);
			} catch (error) { }

			fs.writeFileSync(path.resolve(configFolder, 'config.json'), data, 'utf8');
		}
	}
};