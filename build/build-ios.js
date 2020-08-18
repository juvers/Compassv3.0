#!/usr/bin/env node

// Unlocks the keychain that have the certificate and private key for signing the app, the certificate is defined at build.json.
// Use Keychain Access to add keychains and manage the certificates

// Configuration variables
const KEYCHAIN = '/Users/Shared/compass.keychain';
const KEYCHAIN_PASSWORD = 'KeychainPassowrd';

// -----------------------------------------------------------------------------------------------------------------------------------------------------

const spawn = require('child_process').spawnSync;

const commandArgsArray = process.argv.slice(2);
const commandArgs = commandArgsArray
    .filter(arg => !arg.startsWith('--password'))
    .join(' ')
    .trim();

const isProd = commandArgsArray.includes('--release');

if (isProd) {
    const overridePassword = commandArgsArray
        .filter(arg => arg.startsWith('--password'))
        .map(arg => arg.replace('--password=', ''))[0];

    let password;
    if (overridePassword) {
        password = overridePassword.replace("'", '').replace('"', '');
        console.log('Using custom password');
    } else {
        password = KEYCHAIN_PASSWORD;
    }

    const defaultKeychain = `/usr/bin/security default-keychain -d user -s ${KEYCHAIN}`;
    const unlockKeychain = `/usr/bin/security unlock-keychain -p ${password} ${KEYCHAIN}`;
    const defaultKeychainReturn = spawn(defaultKeychain, {
        stdio: 'inherit',
        shell: true
    });
    const unlockKeychainReturn = spawn(unlockKeychain, {
        stdio: 'inherit',
        shell: true
    });

    if (defaultKeychainReturn.status === 0 && unlockKeychainReturn.status === 0) {
        console.log('keychain unlocked');
    } else {
        console.log('error:');
        console.log('security default-keychain');
        console.log(defaultKeychainReturn);
        console.log('security unlock-keychain');
        console.log(unlockKeychainReturn);
        throw new Error();
    }
} else {
    console.log('Skiped signing for non-release version');
}

const build = `ionic cordova build ios --buildConfig=build/build.json ${commandArgs}`;
console.info(build);
const buildReturn = spawn(build, {
    stdio: 'inherit',
    shell: true
});

if (buildReturn.error) {
    console.log(buildReturn.error);
} else {
    console.log('build successful');
}
