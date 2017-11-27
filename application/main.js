let Vue = require('vue/dist/vue.common.js');
let Layout = require('./views/layout');

Vue.prototype.$store = new Vue({
	data: {
		projects: []
	}
});

new Vue({
	el: '#application-container',
	render: h => h(Layout)
});