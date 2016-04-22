'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var parse = require('css-parse');
var path = require('path');
var jsonfile = require('jsonfile');
var fs = require('fs');

module.exports = function (opts) {
	opts = opts || {};

	// defaults
	opts.depthAllowed = opts.depthAllowed || 3;
	opts.showStats = opts.showStats || true;
	opts.showSelectors = opts.showSelectors || false;
	opts.throwError = opts.throwError || false;


	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-cssdepth-check', 'Streaming not supported'));
			return;
		}

		var _s = {
			file: '',
			errors: {
			}
		};

		try {
			var _selectors = [];
			var collect = parse(file.contents.toString()).stylesheet;
			for(var i=0; i < collect.rules.length; i++) {
          var rule = collect.rules[i];
          if(rule.type === 'rule') {
							rule.selectors.forEach(function(s){
								var _s = s.split(/[\s.:]+/);
								_s = _s.filter(function(n){ return n != "" && n != undefined });
								_selectors.push({selector: s, count: _s.length});
							});
          }
      }

			_selectors.forEach(function(item){
				if(item.count > opts.depthAllowed) {
					if(_s.errors[item.count] === undefined) {
						_s.errors[item.count] = {
							count: 0,
							selectors: []
						};
					}
					_s.errors[item.count].count += 1;
					_s.errors[item.count].selectors.push(item.selector);
				}
			});

			// log to json file if needed
			var __prevStats = null;
			if(opts.logFolder){
				_s.file = path.basename(file.path);
				var _logfile = opts.logFolder + '/' + _s.file + '-check.json'

				if (fs.existsSync(_logfile)){
					__prevStats = jsonfile.readFileSync(_logfile);
				}

				if (!fs.existsSync(opts.logFolder)){
					var mkdirp = require('mkdirp');
				  mkdirp.sync(opts.logFolder);
				}

				jsonfile.spaces = 4;
				jsonfile.writeFileSync(_logfile, _s);
			}

			// generate console log when requested
			if(opts.showStats || opts.showSelectors) {
				gutil.log('CSS Depth Check Report for', _s.file);

				var Table = require('cli-table2');
				var aligns = ['left', 'right', 'right', 'right'];
				if(opts.showStats){
					var headers = ['Selector Depth', 'Instances', 'Previous', 'Change'];
					if(opts.showSelectors) {
						headers.push('Selectors');
					}

					var dash = new Table({ head: headers, colAligns: aligns });
					var _showStats = [];
					for (var key in _s.errors) {
						if (_s.errors.hasOwnProperty(key)) {
							var _item = [key, _s.errors[key].count];

							if(__prevStats !== null) {
								var _last = __prevStats.errors[key];
								if(!_last) {
									_item.push('N/A');
									_item.push('N/A');
								} else {
									_item.push(_last.count);
									var _change = (((_s.errors[key].count - _last.count) / _last.count) * 100);
									_item.push(  (Math.round(_change * 100) / 100)+ '%' );
								}
							} else {
								_item.push('N/A');
								_item.push('N/A');
							}

							if(opts.showSelectors) {
								_item.push(_s.errors[key].selectors.join('\n'));
							}

							_showStats.push(_item);
						}
					}

					if(_showStats.length > 0) {
						dash.push.apply(dash, _showStats);
					  gutil.log('\n' + dash.toString(), '\n');
					}
				}

			}
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-cssdepth-check', err, {fileName: file.path}));
		}

		if(opts.throwError && Object.keys(_s.errors).length > 0) {
			this.emit('error', new gutil.PluginError('gulp-cssdepth-check', 'There are CSS selectors that exceeds maximum depth.', {fileName: file.path}));
		}

		cb(null, file);
	});
};
