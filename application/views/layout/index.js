let fs = require('fs');
let path = require('path');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
let ProjectList = require('../project-list');
let ProjectAdd = require('../project-add');

module.exports = {
	template: template,

	components: { ProjectList, ProjectAdd },

	data() {
		return {
			activeTab: 1
		};
	},

	methods: {
		changeTab(tabNumber) {
			this.activeTab = tabNumber;
		}
	}
};