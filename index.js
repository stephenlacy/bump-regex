'use strict';

const semver = require('semver');

module.exports = function(opts, cb) {
  let str = opts.str;
  opts.key = opts.key || 'version';

  let regex = opts.regex || new RegExp(
    '([\'|\"]?' + opts.key + '[\'|\"]?[ ]*:[ ]*[\'|\"]?)(\\d+\\.\\d+\\.\\d+(-' +
    opts.preid +
    '\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|\"]?)', 'i');

  if (opts.global) {
    regex = new RegExp(regex.source, 'gi');
  }

  let parsedOut;
  str = str.replace(regex, function(match, prefix, parsed, pre, nopre, suffix) {
    parsedOut = parsed;
    if (!semver.valid(parsed) && !opts.version) {
      return cb('Invalid semver ' + parsed);
    }
    const version = opts.version || semver.inc(parsed, (opts.type || 'patch'), opts.preid);
    return prefix + version + (suffix || '');
  });

  if (!parsedOut) {
    return cb('Invalid semver');
  }

  return cb(null, str);
};

