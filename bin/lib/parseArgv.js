#!/usr/bin/env node

const commandLineArgs  = require('command-line-args');
const commandLineUsage = require('command-line-usage');


// Arguments definitions applied to all the commands
const commandArgvDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
];

// A custom configuration object for each command
const commandConfigurations = {
  create: {
    mergeArgvDefinitions: [
      { name: 'appPath', defaultOption: true, default: 'mooglee-app' },
      { name: 'yes', alias: 'y', type: Boolean },
    ],
  },
};

// Usage guides sections for each command
const usageGuideSections = {
  default: [
    {
      header: 'Usage',
      content: 'mooglee <command> [options]',
    },
    {
      header: 'Commands',
      optionList: [
        {
          name: 'create [app_directory]',
          description: 'Create a new app in a given directory',
          type: Boolean
        },
      ],
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'help',
          alias: 'h',
          description: 'Output this usage information',
          type: Boolean
        },
        {
          name: 'version',
          alias: 'v',
          description: 'Output the version number',
          type: Boolean
        },
      ],
    },
  ],
  create: [
    {
      header: 'Usage',
      content: 'mooglee create <app_path>',
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'yes',
          alias: 'y',
          description: 'Generate your app by avoiding the configuration form',
          type: Boolean
        },
        {
          name: 'help',
          alias: 'h',
          description: 'Output this usage information',
          type: Boolean
        },
      ],
    },
  ],
};


/**
 * Print the usage guide
 * @param level
 */
function showUsage(level = 'default') {
  console.log(commandLineUsage(usageGuideSections[level] || usageGuideSections.default));
  process.exit(0);
}

module.exports = function () {

  /* first - parse the main command */
  const mainDefinitions = [
    { name: 'command', defaultOption: true },
    { name: 'version', alias: 'v', type: Boolean },
    ...commandArgvDefinitions,
  ];

  const mainArgv = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
  const argv     = mainArgv._unknown || [];

  if (!mainArgv.command) {
    mainArgv.command = 'create';
  }

  const commandConfiguration = commandConfigurations[mainArgv.command];

  if (!commandConfiguration || mainArgv.help) {
    showUsage(mainArgv.command);
  }

  /* second - parse the merge command options */
  const finalArgv = commandLineArgs([...commandConfiguration.mergeArgvDefinitions, ...commandArgvDefinitions],
    { argv });

  if (!finalArgv || finalArgv.help) {
    showUsage(mainArgv.command);
  }

  // Put default values to u,defined arguments
  commandConfiguration.mergeArgvDefinitions.forEach(function (_definition) {
    if (!finalArgv[_definition.name] && _definition.default) {
      finalArgv[_definition.name] = _definition.default;
    }
  });

  return Object.assign({}, mainArgv, finalArgv);
};