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
    [path.resolve(__dirname, '../bin/index.js'), 'create', PROJECT_NAME, '--yes', '--port', PORT],
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

function defaultTestsSuite() {
  const processes = {};

  it('Run the dev app without errors', function (done) {
    processes.dev = spawn(
      'npm',
      ['run', 'dev'],
      { cwd: path.resolve(__dirname, `./${PROJECT_NAME}`) },
    );

    processes.dev.stderr.on('data', function (data) {
      assert.fail(data);
    });

    processes.dev.stdout.on('data', function (data) {
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

  it('Kill the dev process', function () {
    if (typeof processes.dev.kill === 'function') {
      processes.dev.kill();
    } else {
      assert.fail(`Fail to kill the dev process`);
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

  it('Start the production app without errors', function (done) {
    processes.prod = spawn(
      'npm',
      ['start'],
      { cwd: path.resolve(__dirname, `./${PROJECT_NAME}`) },
    );

    processes.prod.stderr.on('data', function (data) {
      assert.fail(data);
    });

    processes.prod.stdout.on('data', function (data) {
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

  it('Kill the prod process', function () {
    if (typeof processes.prod.kill === 'function') {
      processes.prod.kill();
    } else {
      assert.fail(`Fail to kill the prod process`);
    }
  });
}


describe('CLI "create" command tests', function () {
  if (process.argv.includes('--delay')) {
    create(run, true);
  }

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

  describe('Run default tests suites', function () {
    defaultTestsSuite.call(this);
  });

  // describe('Test ejecting', function ()  {
  //   it('Eject the app without errors', function (done) {
  //     const command = spawn(
  //       'npm',
  //       ['run', 'eject'],
  //       { cwd: path.resolve(__dirname, `./${PROJECT_NAME}`) },
  //     );
  //
  //     command.stderr.on('data', function (data) {
  //       assert.fail(data);
  //     });
  //
  //     command.on('exit', function (data) {
  //       done();
  //     });
  //   });
  //
  //   describe('Run default tests suites after ejecting', function() {
  //     defaultTestsSuite.call(this);
  //   });
  // });
});
