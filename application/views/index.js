let fs = require('fs');
let path = require('path');
let os = require('os');
let { dialog } = require('electron').remote;
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
let ProjectList = require('./projects/list');
let ProjectInit = require('./projects/init');

module.exports = {
	template: template,

	components: { ProjectList, ProjectInit },

	data() {
		return {
			projects: '',

			loading: false,
			showInitProjectModal: false,
			successMessage: '',
			errorMessage: ''
		};
	},

	created() {
		this.projects = this.getPersistedProjects();
	},

	methods: {
		getPersistedProjects() {
			let home = os.homedir();
			let projectsFile = path.resolve(home, '.front-app/projects.json');

			try {
				return require(projectsFile);
			} catch (error) {
				return [];
			}
		},

		addExistingProject() {
			dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, (folders) => {
				if (folders) {
					folders.forEach(folder => {
						try {
							this.loading = true;

							let pkg = require(path.resolve(folder, 'package.json'));
							let webpackConfig = require(path.resolve(folder, 'build/webpack.config.dev.js'));

							if (webpackConfig) {
								let projectsExists = this.projects.find(p => p.path === folder);

								if (projectsExists) {
									this.errorMessage = 'The project is already registered.';

									setTimeout(() => {
										this.errorMessage = '';
									}, 5000);
								} else {
									this.projects.push({
										_id: new Date().getTime(),
										name: pkg.name,
										path: folder
									});

									this.persistChanges();
								}
							}
						} catch (error) {
							this.errorMessage = 'Only <strong>Front CLI</strong> generated projects are allowed.';
						} finally {
							this.loading = false;
						}
					});
				}
			});
		},

		persistChanges() {
			let home = os.homedir();
			let configFolder = path.resolve(home, '.front-app');
			let data = JSON.stringify(this.projects);

			try {
				fs.mkdirSync(configFolder);
			} catch (error) {}

			fs.writeFileSync(path.resolve(configFolder, 'projects.json'), data, 'utf8');
		},

		remove(project) {
			try {
				this.projects = this.projects.filter(p => p._id !== project._id);
				this.persistChanges();

				this.successMessage = 'Project removed successfully!';

				setTimeout(() => {
					this.successMessage = '';
				}, 5000);
			} catch (error) {
				console.error(error);
				this.errorMessage = 'There was an error removing the project.';
			}
		},

		onInitProjectSuccess({ name, path }) {
			this.projects.push({ _id: new Date().getTime(), name, path });
			this.persistChanges();

			this.showInitProjectModal = false;
		}
	}
};