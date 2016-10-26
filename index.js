'use strict';

const format = require('path').format;
const execa = require('execa').shell;
const NAME = 'fly-shell';

module.exports = function () {
	const setError = msg => this.emit('plugin_error', {
		error: msg,
		plugin: NAME
	});

	this.plugin('shell', {every: 0}, function * (files, cmd, opts) {
		opts = opts || {};

		if (typeof cmd !== 'string') {
			opts = cmd;
			cmd = opts.cmd;
		}

		const args = opts.args || [];

		if (!cmd) {
			return setError('No command received!');
		}

		const isGlob = opts.glob || 0;

		// output header
		const head = `${NAME}:${isGlob ? '\n\t' : ' '}`;
		const tail = isGlob ? '\n\t' : '\n';

		const runWith = str => {
			// use file or glob
			const c = cmd.replace(/\$(file|glob)/gi, str);
			// pass all args to execa
			return execa.apply(this, [c, args, opts]).then(res => {
				this.$.log(head + res.stdout.replace(/\n/g, tail));
			}).catch(err => {
				setError(err.message);
			});
		};

		const src = isGlob ? this._.globs : files.map(format);
		return yield Promise.all(src.map(runWith));
	});
};
