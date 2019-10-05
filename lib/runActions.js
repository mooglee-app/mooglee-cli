#!/usr/bin/env node

const chalk = require('chalk');

module.exports = function (actions, config) {

  let _counter = 0;
  let next     = function () {};
  const data   = {};

  /**
   * The next callback function used to execute the actions
   * @param res
   */
  next = function (res = {}) {

    // Throw any error
    if (res.error) {
      config.spinner.fail(chalk.red(res.error));
      process.exit(1);
    }

    // Log a success message after every action call
    if (_counter > 0 && typeof config.spinner.succeed === 'function') {
      config.spinner.succeed(chalk.green(actions[_counter - 1].desc));
    }

    // Check that there is an action to execute
    const _action = actions[_counter];
    if (_action && typeof _action === 'object' && typeof _action.action === 'function') {

      // Log the action description
      config.spinner = config.spinner.start(chalk.blue(_action.desc));

      _counter++;

      try {
        // Execute the action
        const _ret = _action.action(config, next, data);

        // Handle asynchronous actions call
        if (_ret && typeof _ret.then === 'function') {
          _ret.then(function () {
            next();
          })
            .catch(function (error) {
              next({ error });
            });
        }
      } catch (error) {
        throw error;
      }

    } else {
      console.log();
      console.log(chalk.bold.bgGreen('Your app is ready ! :)'));
      console.log();
      config.spinner.stop();
    }
  };

  // Let's started by executing the first action in the stack
  next();
};