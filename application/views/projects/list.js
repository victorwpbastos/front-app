let fs = require('fs');
let path = require('path');
let template = fs.readFileSync(path.resolve(__dirname, 'list.html'), 'utf8');
let Project = require('./project');

module.exports = {
	template: template,

	props: {
		projects: { required: true }
	},

	components: { Project },

	methods: {
		remove(project) {
			this.$emit('remove', project);
		}
	}
};