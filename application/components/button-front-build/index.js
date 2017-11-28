let fs = require('fs');
let path = require('path');
let os = require('os');
let { spawn } = require('child_process');
let ansiToHTML = require('ansi-to-html');
let kill = require('tree-kill');
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
			running: false
		};
	},

	watch: {
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

			this.child = spawn(command, ['build', '--verbose'], { cwd: this.path });

			this.running = true;

			this.child.stdout.on('data', (data) => {
				if (data && data.length > 1) {
					this.running = true;
					this.output += convert.toHtml(data.toString());
				}
			});

			this.child.stderr.on('data', (data) => {
				this.running = false;
				this.output = convert.toHtml(data.toString());
			});

			this.child.on('error', () => {
				this.running = false;
			});

			this.child.on('close', () => {
				this.running = false;
				this.output = '';
			});
		},

		stop() {
			kill(this.child.pid);
		}
	}
};