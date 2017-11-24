let fs = require('fs');
let path = require('path');
let kill = require('tree-kill');
let ansiToHTML = require('ansi-to-html');
let { spawn } = require('child_process');
let { shell } = require('electron');
let os = require('os');
let template = fs.readFileSync(path.resolve(__dirname, 'project.html'), 'utf8');

let convert = new ansiToHTML();

module.exports = {
	template: template,

	props: {
		project: { required: true }
	},

	data() {
		return {
			startChild: null,
			buildChild: null,
			startOutput: '',
			buildOutput: '',
			address: '',

			isStarting: false,
			isBuilding: false,
			isRunningStart: false,
			isRunningBuild: false,
			showOutput: false,
			showRemoveConfirmationModal: false
		};
	},

	methods: {
		start() {
			let command = os.platform() === 'win32' ? 'front.cmd' : 'front';
			let re = /at: (http:\/\/.+)/i;

			this.startChild = spawn(command, ['start'], { cwd: this.project.path });

			this.isStarting = true;

			this.startChild.stdout.on('data', (data) => {
				if (data && data.toString().length > 1) {
					this.isStarting = false;
					this.isRunningStart = true;

					if (re.exec(data.toString())) {
						this.address = re.exec(data.toString())[1];
					}

					this.startOutput += convert.toHtml(data.toString());
				}
			});

			this.startChild.stderr.on('data', (data) => {
				this.isRunningStart = false;
				this.startOutput = convert.toHtml(data.toString());
			});

			this.startChild.on('error', () => {
				this.isStarting = false;
				this.isRunningStart = false;
			});

			this.startChild.on('close', () => {
				this.isRunningStart = false;
				this.startOutput = '';
				this.showOutput = false;
				this.address = '';
			});
		},

		stop(task) {
			if (task === 'start') {
				kill(this.startChild.pid);
			} else if (task === 'build') {
				kill(this.stopChild.pid);
			}
		},

		build() {
			let command = os.platform() === 'win32' ? 'front.cmd' : 'front';

			this.buildChild = spawn(command, ['build', '--verbose'], { cwd: this.project.path });

			this.isBuilding = true;

			this.buildChild.stdout.on('data', (data) => {
				if (data && data.toString().length > 1) {
					this.isBuilding = false;
					this.isRunningBuild = false;
					this.buildOutput += convert.toHtml(data.toString());
				}
			});

			this.buildChild.stderr.on('data', (data) => {
				this.isRunningBuild = false;
				this.buildOutput = convert.toHtml(data.toString());
			});

			this.buildChild.on('error', () => {
				this.isBuilding = false;
				this.isRunningBuild = false;
			});

			this.buildChild.on('close', () => {
				this.isRunningBuild = false;
				// this.buildOutput = '';
				this.showBuildOutput = false;
			});
		},

		openFolder() {
			shell.openExternal(this.project.path);
		},

		openEditor() {
			let command = os.platform() === 'win32' ? 'code.cmd' : 'code';

			let child = spawn(command, ['.'], { cwd: this.project.path, stdin: 'inherit' });

			child.on('error', () => this.openFolder());
		},

		openBrowser() {
			shell.openExternal(this.address);
		},

		remove() {
			this.$emit('remove', this.project);
		}
	}
};