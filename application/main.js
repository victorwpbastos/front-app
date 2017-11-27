let Vue = require('vue/dist/vue.common.js');
let Home = require('./views/home');

new Vue({
	el: '#application-container',

	render: h => h(Home)
});