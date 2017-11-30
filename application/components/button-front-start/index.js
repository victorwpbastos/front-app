let fs = require('fs');
let path = require('path');
let os = require('os');
let { spawn } = require('child_process');
let ansiToHTML = require('ansi-to-html');
let kill = require('tree-kill');
let { ipcRenderer } = require('electron');
let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8');

let convert = new ansiToHTML();

module.exports = {
	template: template,

	props: {
		path: { required: true }
	},

	data() {
		return {
			child: '',
			output: '',
			address: '',
			running: false,
			loading: false
		};
	},

	watch: {
		address() {
			this.$emit('address', this.address);
		},

		output() {
			this.$emit('output', this.output);
		}
	},

	beforeDestroy() {
		this.stop();
	},

	methods: {
		run() {
			let command = os.platform() === 'win32' ? 'front.cmd' : 'front';
			let re = /at: (http:\/\/.+)/i;

			this.child = spawn(command, ['start'], { cwd: this.path });

			this.loading = true;

			ipcRenderer.send('front-child', this.child);

			this.child.stdout.on('data', (data) => {
				if (data && data.length > 1) {
					this.loading = false;
					this.running = true;

					if (re.exec(data.toString())) {
						this.address = re.exec(data.toString())[1];
					}

					this.output += convert.toHtml(data.toString());
				}
			});

			this.child.stderr.on('data', (data) => {
				this.running = false;
				this.output = convert.toHtml(data.toString());
			});

			this.child.on('error', () => {
				this.loading = false;
				this.running = false;
			});

			this.child.on('close', () => {
				this.loading = false;
				this.running = false;
				this.output = '';
				this.address = '';

				ipcRenderer.send('front-child', null);
			});
		},

		stop() {
			if (this.child.pid) {
				kill(this.child.pid);
				this.child = null;
			}
		}
	}
};