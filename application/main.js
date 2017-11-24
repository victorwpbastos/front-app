let Vue = require('vue/dist/vue.common.js');
let Home = require('./views/index');

new Vue({
	el: '#application-container',

	render(h) {
		return h(Home);
	}
});