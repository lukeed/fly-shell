var exec = require('execa').shell;

var NAME = 'fly-shell';

module.exports = function () {
	this.shell = function () {
		var self = this;
		var args = [].slice.call(arguments);
		var opts = args.pop() || {};
		var cmd = args.shift();
		var isGlob = opts.glob || 0;

		var runWith = function (str) {
			// use file or glob
			var c = cmd.replace(/\$file/gi, str);
			// pass all args to execa
			return exec.apply(self, [c, args, opts]).then(function (res) {
				self.log(NAME + ':' + (isGlob ? '\n\t' : ' ') + res.stdout.replace(/\n/g, isGlob ? '\n\t' : '\n'));
			}).catch(function (err) {
				self.emit('plugin_error', {
					plugin: NAME,
					error: err.message
				});
			});
		};

		if (isGlob) {
			runWith(this._.globs[0]);
		} else {
			this.unwrap(function (files) {
				files.forEach(runWith);
			});
		}

		return this;
	};
};
