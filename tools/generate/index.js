const { generateTemplateFiles } = require('generate-template-files')

const template = process.argv[2]
if (!template) throw new Error('Must specify type of template to generate')

switch (template) {
  case 'module':
    // generateTemplateFiles([
    //   {
    //     option: 'Module Name',
    //     defaultCase: '(pascalCase)',
    //     entry: { folderPath: './tools/templates/module/' },
    //     output: { path: './src/modules/__name__(pascalCase)', pathAndFileNameDefaultCase: '(kebabCase)' },
    //     path: './src/stores/__store__(lowerCase)',
    //   pathAndFileNameDefaultCase: '(kebabCase)'
    //   }
    // ])
    break
  default:
    throw new Error('Invalid template type')
}
