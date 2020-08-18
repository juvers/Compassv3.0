#!/usr/bin/env node

const fs = require('fs');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;

const commandArgsArray = process.argv.slice(2);
const isAndroid = commandArgsArray.some(arg => arg.includes('--android'));
const isIos = commandArgsArray.some(arg => arg.includes('--ios'));
const isProduction = commandArgsArray.some(arg => arg.includes('--prod'));
const allowPush = !commandArgsArray.some(arg => arg.includes('--skip-push'));
if (isIos === isAndroid) {
    console.log('Please speciffy android or ios as --android or --ios.');
} else {
    const buildConfig = JSON.parse(fs.readFileSync('./build/build.json', 'utf8'));
    const platform = isIos ? 'ios' : 'android';
    const hasPlatformConfig = !!buildConfig.compass[platform][isProduction ? 'release' : 'debug'];
    const appcenterApp = !hasPlatformConfig
        ? undefined
        : buildConfig.compass[platform][isProduction ? 'release' : 'debug'].appcenterApp;

    if (!appcenterApp) {
        process.exit();
    }

    const appcenterGroup = buildConfig.compass.appcenterGroup;
    const basePath = buildConfig.compass[platform].path;

    if (isIos) {
        const parser = require('xml2json');
        const configFileXml = fs.readFileSync('./config.xml', 'utf8');
        const configFile = JSON.parse(parser.toJson(configFileXml));
        if (!configFile || !configFile.widget) {
            throw configFile;
        }
        appPath = `${basePath}/${configFile.widget.name}.ipa`;
    } else {
        if (isProduction) {
            appPath = `${basePath}/release/app-release.apk`;
        } else {
            appPath = `${basePath}/debug/app-debug.apk`;
        }
    }

    const releases = JSON.parse(execSync(`appcenter distribute releases list --output json --app ${appcenterApp}`));

    const newReleaseId = releases.map(release => parseInt(release.id)).sort((a, b) => b - a)[0] + 1;
    console.log(`publishing "${appPath}" to "${appcenterApp}"`);
    execSync(
        `appcenter distribute release --file "${appPath}" --release-notes "release: ${newReleaseId}" --app ${appcenterApp} --group ${appcenterGroup}`,
        {
            env: process.env,
            stdio: 'inherit'
        }
    );

    console.log(`release: ${newReleaseId}`);
    const currentTag = `build/${platform}/${newReleaseId}`;

    execSync(`git tag -a ${currentTag} -m ${newReleaseId}`, { env: process.env, stdio: 'inherit' });
    if (allowPush) {
        console.log(`pushing git tag (might require authentication): ${currentTag}`);
        exec(`git push origin ${currentTag}`, { env: process.env, stdio: 'inherit' });
    }
}
