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
			child: null,
			output: '',
			address: '',

			isStarting: false,
			isRunning: false,
			showOutput: false,
			showRemoveConfirmationModal: false
		};
	},

	methods: {
		openFolder() {
			shell.openExternal(this.project.path);
		},

		openEditor() {
			let command = os.platform() === 'win32' ? 'code.cmd' : 'code';

			spawn(command, ['.'], { cwd: this.project.path, stdin: 'inherit' });
		},

		start() {
			let command = os.platform() === 'win32' ? 'front.cmd' : 'front';
			let re = /at: (http:\/\/.+)/i;

			this.child = spawn(command, ['start'], { cwd: this.project.path });

			this.isStarting = true;

			this.child.stdout.on('data', (data) => {
				if (data && data.toString().length > 1) {
					this.isStarting = false;
					this.isRunning = true;

					if (re.exec(data.toString())) {
						this.address = re.exec(data.toString())[1];
					}

					this.output += convert.toHtml(data.toString());
				}
			});

			this.child.stderr.on('data', (data) => {
				this.isRunning = false;

				this.output = convert.toHtml(data.toString());
			});

			this.child.on('close', () => {
				this.isRunning = false;

				this.output = '';
				this.showOutput = false;
				this.address = '';
			});
		},

		stop() {
			kill(this.child.pid);
		},

		openBrowser() {
			shell.openExternal(this.address);
		},

		remove() {
			this.$emit('remove', this.project);
		}
	}
};