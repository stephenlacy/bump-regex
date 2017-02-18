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

  lab.test('set key with dash', function(done) {
    var opts = {
      str: JSON.stringify({'latest-release': '0.1.1'}),
      key: 'latest-release'
    };
    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"latest-release":"0.1.2"}');
      done();
    });
  });

  lab.test('bump version in xml files with dash', function(done) {
    var opts = {
      str: '<latest-version>1.0.0</latest-version>'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('1.0.1');
      code.expect(out.str).to.equal('<latest-version>1.0.1</latest-version>');
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

  lab.test('update existing prerelease without preid', function(done) {
    var opts = {
      str: JSON.stringify({version: '0.1.0-rc.0'}),
      type: 'prerelease'
    };

    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.0-rc.1"}');
      done();
    });

  });

  lab.test('remove prerelease with patch', function(done) {
    var opts = {
      str: JSON.stringify({version: '0.1.0-rc.0'}),
      type: 'patch'
    };

    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.0"}');
      done();
    });

  });
  lab.test('remove prerelease with patch when alpha tag has no version', function(done) {
    var opts = {
      str: JSON.stringify({version: '0.1.0-noversion'}),
      type: 'patch'
    };

    project(opts, function(err, out) {
      code.expect(err).to.equal(null);
      code.expect(out.str).to.equal('{"version":"0.1.0"}');
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
      code.expect(err).to.equal('Invalid semver: version key "version" is not found in file');
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

  lab.test('bump xml version param', function(done) {
    var opts = {
      str: '<version="1.0.0">'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('1.0.1');
      code.expect(out.str).to.equal('<version="1.0.1">');
      done();
    });
  });

  lab.test('bump version in xml files', function(done) {
    var opts = {
      str: '<version>1.0.0</version>'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('1.0.1');
      code.expect(out.str).to.equal('<version>1.0.1</version>');
      done();
    });
  });

  lab.test('bump version in specific xml tag with `case: true`', function(done) {
    var opts = {
      str: '<projectVersion>1.2.3</projectVersion><version>1.0.0</version>',
      case: true
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('1.0.1');
      code.expect(out.str).to.equal('<projectVersion>1.2.3</projectVersion><version>1.0.1</version>');
      done();
    });
  });

  lab.test('bump version with a prefix', function(done) {
    var opts = {
      str: 'version=v1.0.0'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('1.0.1');
      code.expect(out.str).to.equal('version=v1.0.1');
      done();
    });
  });

  lab.test('set a 4 char version without adding a character', function(done) {
    var opts = {
      str: 'version=11.0.0'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('11.0.1');
      code.expect(out.str).to.equal('version=11.0.1');
      done();
    });
  });

  lab.test('set a 4 char version with a version prefix character', function(done) {
    var opts = {
      str: 'version=r11.0.0'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('11.0.1');
      code.expect(out.str).to.equal('version=r11.0.1');
      done();
    });
  });

  lab.test('set a 4 char version with a prefix', function(done) {
    var opts = {
      str: 'version: v101.0.0'
    };
    project(opts, function(err, out) {
      code.expect(out.new).to.equal('101.0.1');
      code.expect(out.str).to.equal('version: v101.0.1');
      done();
    });
  });
});
