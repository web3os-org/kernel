const { version } = require('../../../package.json')
const { program } = require('commander')

program
  .option('--version')

program.parse()

const options = program.opts()
console.log(program.args)
