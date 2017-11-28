let fs = require('fs');
let path = require('path');
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
			showRemoveConfirmationModal: false
		};
	},

	computed: {
		folderExists() {
			return fs.existsSync(this.project.path);
		}
	},

	created() {
		document.addEventListener('keyup', this.closeModalOnEsc);
	},

	beforeDestroy() {
		document.removeEventListener('keyup', this.closeModalOnEsc);
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