'use strict';

var semver = require('semver');

module.exports = function(opts, cb) {
  var str = opts.str;
  opts.key = opts.key || 'version';

  var regex = opts.regex || new RegExp(
    '([\'|\"]?' + opts.key + '[\'|\"]?[ ]*:[ ]*[\'|\"]?)(\\d+\\.\\d+\\.\\d+(-' +
    opts.preid +
    '\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|\"]?)', 'i');

  if (opts.global) {
    regex = new RegExp(regex.source, 'gi');
  }

  var parsedOut;
  str = str.replace(regex, function(match, prefix, parsed, pre, nopre, suffix) {
    parsedOut = parsed;
    if (!semver.valid(parsed) && !opts.version) {
      return cb('Invalid semver ' + parsed);
    }
    var version = opts.version || semver.inc(parsed, (opts.type || 'patch'), opts.preid);
    return prefix + version + (suffix || '');
  });

  if (!parsedOut) {
    return cb('Invalid semver');
  }

  return cb(null, str);
};

