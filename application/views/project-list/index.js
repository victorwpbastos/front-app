let fs = require('fs');
let path = require('path');
let os = require('os');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
let ProjectDetail = require('../project-detail');

module.exports = {
	template: template,

	components: { ProjectDetail },

	data() {
		return {
			loading: false,
		};
	},

	created() {
		this.$store.projects = this.getPersistedProjects();
	},

	methods: {
		getPersistedProjects() {
			let projectsFile = path.resolve(os.homedir(), '.front-app/projects.json');

			try {
				return require(projectsFile);
			} catch (error) {
				return [];
			}
		},

		remove(project) {
			try {
				this.$store.projects = this.$store.projects.filter(p => p._id !== project._id);

				this.successMessage = 'Project removed successfully!';

				setTimeout(() => {
					this.successMessage = '';
				}, 5000);
			} catch (error) {
				console.error(error);
				this.errorMessage = 'There was an error removing the project.';
			}
		}
	}
};