const assert     = require('assert');
const spawn      = require('child_process').spawn;
const fileSearch = require('search-in-file').fileSearch;
const path       = require('path');

const PROJECT_NAME = 'mooglee-test-app';


function clean(cb) {
  const command = spawn('rm', ['-Rf', PROJECT_NAME], { cwd: path.resolve(__dirname) });

  command.on('exit', () => {
    cb();
  });
}

function create(cb, installModules = false) {
  spawn('rm', ['-Rf', PROJECT_NAME], { cwd: path.resolve(__dirname) });
  const command = spawn(
    'node',
    [path.resolve(__dirname, '../bin/index.js'), 'create', PROJECT_NAME, '--yes'],
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
    after(clean);
  }

  it('Check that no template variable remains', async function () {
    try {
      const res = await fileSearch([path.resolve(__dirname, PROJECT_NAME)], /\[%.*%\]/gi, {
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
    this.appDevProcess = spawn(
      'npm',
      ['run', 'dev'],
      { cwd: path.resolve(__dirname, PROJECT_NAME) },
    );

    this.appDevProcess.stderr.on('data', function (data) {
      assert.fail(data);
    });

    this.appDevProcess.stdout.on('data', function (data) {
      if (data.indexOf('> Ready') > -1) {
        assert.ok(data);
        done();
      }
    });
  });
});
