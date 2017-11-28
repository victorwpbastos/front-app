let Vue = require('vue/dist/vue.common.js');
let Layout = require('./views/layout');
let path = require('path');
let os = require('os');
let projectsFile = path.resolve(os.homedir(), '.front-app/projects.json');
let configFile = path.resolve(os.homedir(), '.front-app/config.json');

Vue.prototype.$store = new Vue({
	data: {
		projects: [],
		config: {
			editor: '',
			additionalTemplates: []
		}
	}
});

try {
	Vue.prototype.$store.projects = require(projectsFile);
} catch (error) { }

try {
	Vue.prototype.$store.config = require(configFile);
} catch (error) {}

new Vue({
	el: '#application-container',
	render: h => h(Layout)
});