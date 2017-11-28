let fs = require('fs');
let path = require('path');
let { dialog } = require('electron').remote;
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

module.exports = {
	template: template,

	data() {
		return {
			folder: '',
			name: '',

			errorMessage: '',
			successMessage: '',
			loading: false
		};
	},

	methods: {
		showFolderDialog() {
			dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, (folders) => {
				if (folders) {
					folders.forEach(folder => {
						try {
							this.loading = true;

							let pkg = require(path.resolve(folder, 'package.json'));
							let webpackConfig = require(path.resolve(folder, 'build/webpack.config.dev.js'));

							if (webpackConfig) {
								let projectsExists = this.$store.projects.find(p => p.path === folder);

								if (projectsExists) {
									this.errorMessage = 'The project is already registered.';

									setTimeout(() => {
										this.errorMessage = '';
									}, 5000);
								} else {
									this.name = pkg.name;
									this.folder = folder;
								}
							}
						} catch (error) {
							this.errorMessage = 'Only <strong>Front CLI</strong> generated projects are allowed.';

							setTimeout(() => {
								this.errorMessage = '';
							}, 5000);
						} finally {
							this.loading = false;
						}
					});
				}
			});
		},

		confirm() {
			this.$store.projects.push({
				_id: new Date().getTime(),
				name: this.name,
				path: this.folder
			});

			this.name = '';
			this.folder = '';

			this.successMessage = 'Project added successfully!';

			setTimeout(() => {
				this.successMessage = '';
			}, 5000);
		}
	}
};