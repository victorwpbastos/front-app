let fs = require('fs');
let path = require('path');
let watch = require('node-watch');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');
let ButtonFrontStart = require('../../components/button-front-start');
let ButtonFrontBuild = require('../../components/button-front-build');
let ButtonOpenFolder = require('../../components/button-open-folder');
let ButtonOpenEditor = require('../../components/button-open-editor');
let ButtonOpenBrowser = require('../../components/button-open-browser');

module.exports = {
	template: template,

	props: {
		project: { required: true }
	},

	components: { ButtonFrontStart, ButtonFrontBuild, ButtonOpenFolder, ButtonOpenEditor, ButtonOpenBrowser },

	data() {
		return {
			address: '',
			outputFrontStart: '',
			outputFrontBuild: '',
			showOutput: false,
			showRemoveConfirmationModal: false,
			folderExists: false
		};
	},

	watch: {
		showRemoveConfirmationModal() {
			if (this.showRemoveConfirmationModal) {
				this.$el.addEventListener('keyup', this.closeModalOnEsc);
			} else {
				this.$el.removeEventListener('keyup', this.closeModalOnEsc);
			}
		}
	},

	created() {
		this.folderExists = fs.existsSync(this.project.path);

		this.watcher = watch(path.dirname(this.project.path))

		this.watcher.on('change', event => {
			if (event === 'update') {
				this.folderExists = fs.existsSync(this.project.path);
			}
		});
	},

	beforeDestroy() {
		this.watcher.close();
	},

	methods: {
		closeModalOnEsc(e) {
			if (e && e.keyCode === 27) {
				this.showRemoveConfirmationModal = false;
			}
		},

		remove() {
			this.$emit('remove', this.project);
		}
	}
};