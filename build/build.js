#!/usr/bin/env node

// Signs an apk
// This script is optimized to run on OSX and android build tools 28.0.3. It will need some customization for other build enviroments.
// First define a keystore useing keytool, like this:
// $ keytool -genkey -v -keypass YourPassword -keystore .compass.keystore -alias alias-compass -keyalg RSA -keysize 2048 -validity 10000

// -----------------------------------------------------------------------------------------------------------------------------------------------------
const fs = require('fs');
const execSync = require('child_process').execSync;
const buildConfig = JSON.parse(fs.readFileSync(`${__dirname}/build.json`, 'utf8'));

const commandArgsArray = process.argv.slice(2);
const isProduction = commandArgsArray.includes('--release');
const commandArgs = commandArgsArray
    .filter(arg => !arg.startsWith('--password'))
    .filter(arg => !arg.startsWith('--skip-publish'))
    .filter(arg => !arg.startsWith('--skip-push'))
    .filter(arg => !arg.startsWith('--debug'))
    .filter(arg => !arg.startsWith('--release'))
    .filter(arg => !arg.startsWith('--device'))
    .filter(arg => !(isProduction && arg.startsWith('--prod')))
    .filter(arg => !arg.startsWith('ios'))
    .filter(arg => !arg.startsWith('android'))
    .join(' ')
    .trim();

const skipPublish = commandArgsArray.includes('--skip-publish');
const skipPush = commandArgsArray.includes('--skip-push');
const overridePassword = commandArgsArray
    .filter(arg => arg.startsWith('--password'))
    .map(arg => arg.replace('--password=', ''))[0];

const buildType = isProduction ? 'release' : 'debug';
let isAndroid = commandArgsArray.includes('android');
let isIos = commandArgsArray.includes('ios');
const buildTypeArgs = isProduction ? '--prod --release' : '--debug';

const buildApp = platform => {
    let suffix = '';
    const keychain = buildConfig.compass.ios.keychain;
    const keychainPassword = buildConfig.compass.ios.keychainPassword;
    overridePassword;
    if (overridePassword) {
        const buildDetails = buildConfig[platform][buildType];
        if (isIos) {
            keychainPassword = overridePassword;
        } else {
            suffix = `-- --keystore=${buildDetails.keystore} --storePassword=${overridePassword} --alias=${buildDetails.alias}`;
        }
        console.log('Using custom password');
    }

    if (isIos) {
        execSync(`/usr/bin/security default-keychain -d user -s ${keychain}`, {
            env: process.env,
            stdio: 'inherit'
        });
        execSync(`/usr/bin/security unlock-keychain -p ${keychainPassword} ${keychain}`, {
            env: process.env,
            stdio: 'inherit'
        });
    }

    const buildJsonArg = commandArgs.includes('--buildConfig') ? '' : '--buildConfig=build/build.json';

    const buildCommand = `ionic cordova build ${platform} ${buildJsonArg} --device ${buildTypeArgs} ${commandArgs} ${suffix}`;
    console.log(`building ${platform} ${buildType}:`);
    console.log(buildCommand);

    execSync(buildCommand, {
        env: process.env,
        stdio: 'inherit'
    });
};
if (!isAndroid && !isIos) console.log('Building ionic app www folder');
execSync(`ionic build ${buildTypeArgs} ${commandArgs}`, {
    env: process.env,
    stdio: 'inherit'
});

if (isAndroid) {
    buildApp('android');

    if (!skipPublish) {
        execSync(`npm run publish -- --android ${skipPush ? ' --skip-push' : ''} ${isProduction ? '--prod' : ''}`, {
            env: process.env,
            stdio: 'inherit'
        });
    }
}
if (isIos) {
    buildApp('ios');

    if (!skipPublish) {
        execSync(`npm run publish -- --ios ${skipPush ? ' --skip-push' : ''} ${isProduction ? '--prod' : ''}`, {
            env: process.env,
            stdio: 'inherit'
        });
    }
}
