const assert     = require('assert');
const spawn      = require('cross-spawn');
const fileSearch = require('search-in-file').fileSearch;
const path       = require('path');
const fetch      = require('node-fetch');

const PROJECT_NAME = 'mooglee-test-app';
const PORT         = 3001;

function create(cb, installModules = false) {
  spawn.sync('rm', ['-Rf', `./${PROJECT_NAME}`], { cwd: path.resolve(__dirname) });

  const command = spawn(
    'node',
    [path.resolve(__dirname, '../bin/index.js'), 'create', PROJECT_NAME, '--yes', `--port ${PORT}`],
    { cwd: path.resolve(__dirname) },
  );

  command.stdout.on('data', function (data) {
    console.log((data.toString() || '').replace(/\n/, ''));
  });

  if (installModules) {
    command.on('exit', () => {
      cb();
    });
  } else {
    setTimeout(() => {
      cb();
    }, 10000);
  }
}


describe('CLI "create" command tests', function () {
  if (process.argv.includes('--delay')) {
    create(run, true);
  }

  after(function (done) {
    !!this.appProcess && this.appProcess.kill();
    done();
  });

  it('Check that no template variable remains', async function () {
    try {
      const res = await fileSearch([path.resolve(__dirname, `./${PROJECT_NAME}`)], /\[%.*%\]/gi, {
        recursive: true,
        isRegex: true,
        ignoreDir: ['node_modules'],
      });
      assert.equal(res.length, 0);
    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('Run the dev app without errors', function (done) {
    this.appProcess = spawn(
      'npm',
      ['run', 'dev'],
      { cwd: path.resolve(__dirname, `./${PROJECT_NAME}`) },
    );

    this.appProcess.stderr.on('data', function (data) {
      assert.fail(data);
    });

    this.appProcess.stdout.on('data', function (data) {
      if (data.indexOf('> Ready') > -1) {
        assert.ok(data);
        done();
      }
    });
  });

  it('Get a 200 response when making a request to the app', async function () {
    try {
      const res = await fetch(`http://localhost:${PORT}`);

      assert.equal(res.status, 200);
    } catch (err) {
      assert.fail(err.message);
    }
  });

  it('Build the dev app without errors', function (done) {
    const build = spawn(
      'npm',
      ['run', 'build'],
      { cwd: path.resolve(__dirname, `./${PROJECT_NAME}`) },
    );

    build.on('exit', () => {
      done();
    });
  });

  it('Start the dev app without errors', function (done) {
    this.appProcess = spawn(
      'npm',
      ['run', 'start'],
      { cwd: path.resolve(__dirname, `./${PROJECT_NAME}`) },
    );

    this.appProcess.stderr.on('data', function (data) {
      assert.fail(data);
    });

    this.appProcess.stdout.on('data', function (data) {
      if (data.indexOf('> Ready') > -1) {
        assert.ok(data);
        done();
      }
    });
  });

});
