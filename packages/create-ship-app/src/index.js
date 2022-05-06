#!/usr/bin/env node

const gradient = require('gradient-string');
const figlet = require('figlet');

const utils = require('./utils');
const { buildTypes, apiTypes } = require('./config');
const buildSteps = require('./build-steps');

let projectName;
let buildType;
let apiType;
let dbType;
let deploymentType;

(async () => {
  console.clear();
  console.log(`Hey! Let’s build your ${gradient.pastel('Ship')} 🚀`);
  
  projectName = utils.getCLIArgs();
  
  if (projectName === 'init') {
    projectName = await buildSteps.askProjectName();
  } else {
    console.log(`Project name: ${projectName}`);
  }
  
  buildType = await buildSteps.askBuildType();
  
  if (buildType === buildTypes.ONLY_BACKEND || buildType === buildTypes.FULL_STACK) {
    apiType = await buildSteps.askApiType();
    
    if (apiType === apiTypes.DOTNET) {
      dbType = await buildSteps.askDbType();
    }
  }
  
  if (buildType === buildTypes.FULL_STACK) {
    deploymentType = await buildSteps.askDeploymentType();
  }
  
  const dockerComposeFileName = utils.getDockerComposeFileName(apiType, dbType);
  const deploymentFolderNames = utils.getDeploymentFolderNames(deploymentType, apiType, dbType);
  
  await utils.installServices(projectName, buildType, apiType, dbType, dockerComposeFileName, deploymentFolderNames);
  
  figlet('Happy coding!', (err, data) => {
    const runCommand = utils.getRunCommand(buildType, apiType);
    
    console.log(gradient.pastel.multiline(data) + '\n');
    console.log(`Run application: cd ${projectName} && ${runCommand}`);
    process.exit(0);
  });
})();
