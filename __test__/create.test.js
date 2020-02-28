const assert     = require('assert');
const spawn      = require('cross-spawn');
const fileSearch = require('search-in-file').fileSearch;
const path = require('path')

function clean(done) {
  const command = spawn('rm', ['-Rf', path.resolve(__dirname, '../mooglee-test-app')]);

  command.on('exit', () => {
    done();
  });
}

function create(done, installModules = false) {
  spawn('rm', ['-Rf', path.resolve(__dirname, '../mooglee-test-app')]);
  const command = spawn('node', [path.resolve(__dirname, '../bin/index.js'), 'create', 'mooglee-test-app', '--yes']);

  command.stdout.on('data', function (data) {
    console.log((data.toString() || '').replace(/\n/, ''));
  });

  if (installModules) {
    command.on('exit', () => {
      done();
    });
  } else {
    setTimeout(() => {
      done();
    }, 10000);
  }
}


describe('CLI "create" command tests', function () {
  create(run, false);
  after(clean);

  it('Check that no template variable remains', async function () {
    const res = await fileSearch([path.resolve(__dirname, '../mooglee-test-app')], /\[%.*%\]/gi, {
      recursive: true,
      isRegex: true,
      ignoreDir: ['node_modules'],
    });
    assert.equal(res.length, 0);
  });

});
