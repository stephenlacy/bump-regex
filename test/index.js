'use strict';

const lab = exports.lab = require('lab').script();
const code = require('code');
const PROJECT_NAME = 'bump-regex';
const project = require('..');

lab.experiment(PROJECT_NAME, function() {
  const options = {
    str: JSON.stringify({version: '0.1.0'})
  };

  lab.test('no options', function(done) {
    project(options, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.1"}');
      done();
    });
  });

  lab.test('patch', function(done) {
    let opts = options;
    opts.type = 'patch';
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.1"}');
      done();
    });
  });

  lab.test('minor', function(done) {
    let opts = options;
    opts.type = 'minor';
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.2.0"}');
      done();
    });
  });

  lab.test('major', function(done) {
    let opts = options;
    opts.type = 'major';
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"1.0.0"}');
      done();
    });
  });

  lab.test('set version', function(done) {
    var opts = options;
    opts.version = '3.2.1';
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"3.2.1"}');
      done();
    });
  });

  lab.test('set key', function(done) {
    var opts = {
      str: JSON.stringify({appversion: '0.1.0'}),
      key: 'appversion'
    };
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"appversion":"0.1.1"}');
      done();
    });

  });

  lab.test('set preid', function(done) {
    var opts = {
      str: JSON.stringify({version: '0.1.0'}),
      type: 'prerelease',
      preid: 'thing'
    };

    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.1-thing.0"}');
      done();
    });

  });

  lab.test('set preid', function(done) {
    var opts = {
      str: JSON.stringify({version: '0.1.0-thing.0'}),
      type: 'prerelease',
      preid: 'thing'
    };

    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.0-thing.1"}');
      done();
    });

  });

  lab.test('set global', function(done) {
    var opts = {
      str: JSON.stringify({
        version: '0.1.0',
        test: {
          version: '0.1.2'
        }
      }),
      global: true
    };

    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.1","test":{"version":"0.1.3"}}');
      done();
    });

  });

  lab.test('set on text file', function(done) {
    var opts = {
      str: 'swift \n Version: "0.1.2"'
    };
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('swift \n Version: "0.1.3"');
      done();
    });
  });

  lab.test('error with invalid semver', function(done) {
    var opts = {
      str: 'swift \n Version: "0.A.2"'
    };
    project(opts, function(err) {
      code.expect(err).to.equal('Invalid semver');
      done();
    });
  });

  lab.test('return new version', function(done) {
    var opts = {
      str: JSON.stringify({version: '1.2.0'})
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('1.2.1');
      done();
    });
  });

  lab.test('return update type', function(done) {
    var opts = {
      str: JSON.stringify({version: '1.2.0'})
    };
    project(opts, function(err, out) {
      code.expect(out.type).to.equal('patch');
      done();
    });
  });
  lab.test('return prev version', function(done) {
    var opts = {
      str: JSON.stringify({version: '1.2.0'})
    };
    project(opts, function(err, out) {
      code.expect(out.prev).to.equal('1.2.0');
      done();
    });
  });
});
