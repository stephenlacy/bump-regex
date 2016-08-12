'use strict';

var semver = require('semver');
var clone = require('lodash.clone');

module.exports = function(options, cb) {
  var opts = clone(options);
  opts.key = opts.key || 'version';
  opts.type = opts.type || 'patch';

  var regex = opts.regex || new RegExp(
    '([\'|\"]?' + opts.key + '[\'|\"]?[ ]*:[ ]*[\'|\"]?)(\\d+\\.\\d+\\.\\d+)' +
    '(-[0-9A-Za-z\.-]+)?([\'|\"]?)', 'i');

  if (opts.global) {
    regex = new RegExp(regex.source, 'gi');
  }

  var parsedOut;
  opts.str = opts.str.replace(regex, function(match, prefix, parsed, prerelease, suffix) {
    parsed = parsed + (prerelease || '')
    parsedOut = parsed;
    if (!semver.valid(parsed) && !opts.version) {
      return cb('Invalid semver ' + parsed);
    }
    var version = opts.version || semver.inc(parsed, opts.type, opts.preid);
    opts.prev = parsed;
    opts.new = version;
    return prefix + version + (suffix || '');
  });

  if (!parsedOut) {
    return cb('Invalid semver: version key "' + opts.key + '" is not found in file');
  }

  return cb(null, opts);
};
