#!/usr/bin/env node

const commandLineArgs  = require('command-line-args');
const commandLineUsage = require('command-line-usage');



const CREATE_OPTION_LIST = [
  {
    name: 'yes',
    alias: 'y',
    description: 'Generate your app by avoiding the configuration form',
    type: Boolean,
  },
  {
    name: 'use-yarn',
    description: 'Use yarn instead of NPM',
    type: Boolean,
    defaultOption: false
  },
  {
    name: 'port',
    description: 'Define the port to be used',
    type: Number,
  },
  {
    name: 'enable-sw',
    description: 'Enable the service worker for production',
    type: Boolean,
  },
  {
    name: 'enable-i18n',
    description: 'Enable the i18n services for multi-language apps',
    type: Boolean,
  },
  {
    name: 'use-api',
    description: 'Define that an API will be used to fetch data for the app pages and/or settings',
    type: Boolean,
  },
];

const GENERATE_OPTION_LIST = [
  {
    name: 'name',
    alias: 'n',
    description: 'The name of the component|page to generate',
    type: String,
  },
  {
    name: 'use-class',
    alias: 'c',
    description: 'Use a React class component instead of a function',
    type: Boolean,
  },
];

// Arguments definitions applied to all the commands
const COMMON_OPTION_LIST = [
  { name: 'help', alias: 'h', type: Boolean },
];

/** //////// All the following code may not need to be edited //////// **/

// A custom configuration object for each command
const commandConfigurations = {
  create: {
    mergeArgvDefinitions: [
      { name: 'appPath', defaultOption: true, default: 'mooglee-app' },
      ...CREATE_OPTION_LIST
    ],
  },
  generate: {
    mergeArgvDefinitions: [
      { name: 'type', defaultOption: true },
      ...GENERATE_OPTION_LIST
    ],
  },
  run: {
    mergeArgvDefinitions: [
      { name: 'script', defaultOption: true, type: String },
    ],
  },
};

// Usage guides sections for each command
const usageGuideSections = {
  default: [
    {
      header: 'Usage',
      content: '$ mooglee <command> [options]',
    },
    {
      header: 'Commands',
      content: [
        {
          desc: '$ mooglee create [app_directory]',
          example: 'Create a new app in a given directory',
        },
        {
          desc: '$ mooglee generate [type]',
          example: 'Generate a new empty page or a new empty component',
        },
        {
          desc: '$ mooglee run [command]',
          example: 'Run a command in your project. Can be one of [start|dev|build|eject|(json-server:dev|json-server:prod)]',
        },
        {
          desc: '$ mooglee <command> --help',
          example: 'Show usage for <command>',
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
          type: Boolean,
        },
        {
          name: 'version',
          alias: 'v',
          description: 'Output the version number',
          type: Boolean,
        },
      ],
    },
  ],
  create: [
    {
      header: 'Usage',
      content: '$ mooglee create <app_path>',
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'help',
          alias: 'h',
          description: 'Output this usage information',
          type: Boolean,
        },
        ...CREATE_OPTION_LIST
      ],
    },
  ],
  generate: [
    {
      header: 'Usage',
      content: '$ mooglee generate [component|page]',
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'help',
          alias: 'h',
          description: 'Output this usage information',
          type: Boolean,
        },
        ...GENERATE_OPTION_LIST
      ],
    },
  ],
  run: [
    {
      header: 'Usage',
      content: '$ mooglee run [start|dev|build|eject]',
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
    ...COMMON_OPTION_LIST,
  ];

  const mainArgv = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
  const argv     = mainArgv._unknown || [];

  if (!mainArgv.command) {
    showUsage(mainArgv.default);
  }

  const commandConfiguration = commandConfigurations[mainArgv.command];

  if (!commandConfiguration || mainArgv.help) {
    showUsage(mainArgv.command);
  }

  /* second - parse the merge command options */
  const finalArgv = commandLineArgs([...commandConfiguration.mergeArgvDefinitions, ...COMMON_OPTION_LIST],
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
