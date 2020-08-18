# SEI Compass 2

- [SEI Compass 2](#sei-compass-2)
  - [Communication](#communication)
  - [Server](#server)
  - [Git](#git)
  - [Dev Environment setup](#dev-environment-setup)
    - [Pre-requisites](#pre-requisites)
    - [Install latest LTS nodejs](#install-latest-lts-nodejs)
    - [Install global packages](#install-global-packages)
    - [Cocoapods](#cocoapods)
    - [Install local packages and add platforms](#install-local-packages-and-add-platforms)
    - [Cocoapods dependencies](#cocoapods-dependencies)
    - [Push Notifications](#push-notifications)
    - [Appcenter setup](#appcenter-setup)
    - [Build configuration](#build-configuration)
  - [Building and running](#building-and-running)
      - [Serve - build www folder and serve via http](#serve---build-www-folder-and-serve-via-http)
    - [Emulator](#emulator)
      - [Run emulator](#run-emulator)
      - [Run emulator with livereload](#run-emulator-with-livereload)
    - [Build](#build)
      - [www folder](#www-folder)
      - [android app](#android-app)
        - [android app - production](#android-app---production)
      - [ios app](#ios-app)
        - [Build ios app - production](#build-ios-app---production)
      - [build ios and android](#build-ios-and-android)
        - [Build ios app - production](#build-ios-app---production-1)
    - [More information](#more-information)
    - [publishing without building](#publishing-without-building)
      - [android](#android)
        - [android production](#android-production)
      - [ios](#ios)
        - [ios production](#ios-production)
  - [Configuration](#configuration)
    - [Icon and Splashscreen](#icon-and-splashscreen)
    - [Settings and ionic css variables](#settings-and-ionic-css-variables)
    - [Angular Material](#angular-material)
    - [Assets](#assets)
    - [Welcome Page](#welcome-page)
      - [The config object format](#the-config-object-format)
      - [Item configuration inheritance](#item-configuration-inheritance)
    - [Menu](#menu)
  - [Migration from seiCompass 1](#migration-from-seicompass-1)
    - [Plugin compatibility upgrade by phases](#plugin-compatibility-upgrade-by-phases)
      - [Installed by default by ionic](#installed-by-default-by-ionic)
      - [Will not upgrade](#will-not-upgrade)
      - [Maybe we will need later](#maybe-we-will-need-later)
      - [Phase A2](#phase-a2)
      - [Phase A3](#phase-a3)
      - [Phase A5](#phase-a5)
      - [QR Code generator](#qr-code-generator)
  - [Tasks](#tasks)
    - [Phase A1](#phase-a1)
    - [Phase A2](#phase-a2-1)
    - [Phase A3](#phase-a3-1)

## Communication

Rodrigo:
Some of the more technical as aspects can be discussed here as I am outlining the tasks here for my reference too. I added the keyword **Question** arround the document, so the SEI team can go ahead and write **Answer** under it, this way I can keep all in the same place to work all inside the IDE. This is for during the development, later I will cleanup this file.

## Server

54.71.65.200

## Git

There is a remote git repository setup on the server at /www/seiCompass2.git.

Developers can connect their git remote repositories to the following url:

```
ssh://[username]@54.71.65.200/www/seiCompass2.git
```

In addition to the remote server the source code can be found at /www/seiCompass2, this folder tracks to the remote repository above. Don't forget to also run git pull like any normal local repository.

## Dev Environment setup
### Pre-requisites
- Latest Android studio (for android builds)
- Latest XCode (for ios builds)

### Install latest LTS nodejs

At this time 12.13.1.



### Install global packages

```
npm install -g ionic
npm install -g native-run
npm install -g cordova
npm install -g ios-sim
npm install -g ios-deploy
npm install -g cordova-res
npm install -g appcenter-cli
```


### Cocoapods
```
sudo gem install cocoapods
```

### Install local packages and add platforms

```
npm install
ionic cordova platform add android
ionic cordova platform add ios
```

### Cocoapods dependencies
For ios firebase we need to update the cocoapods to the latest, 1.8.4 at this time.

```
sudo gem install cocoapods-dependencies
cd platforms/ios/
pod dependencies
```

### Push Notifications

The files google-services.json and GoogleService-Info.plist need to be exported from firebase console and pasted on the root folder of the app.

### Appcenter setup

If using appcenter for releases and updates run once:

```
appcenter login
```

This will open a browser login window for linking microsoft (or other social network) accounts. It will give you acces to a key to be pasted back to the command. 
* Example key - 08bf539d8de29eb281b25d5f954cf67104fe2027

Setup the apps according to the values defined on `build/build.json`.

### Build configuration

Edit the file `build/build.json` for changing the build variables. This is a standard cordova build.json file with an added property "compass" with custom values for using on the build scripts. 

The file with default values is described bellow:
```js
    "ios": {
        "debug": {
            "developmentTeam": "8LLU46YY79",
            "automaticProvisioning": true,
            "packageType": "development"
        },
        "release": {
            "developmentTeam": "8LLU46YY79",
            "codeSignIdentity": "SEI",
            "provisioningProfile": "PROVISIONING_PROFILE_NAME",
            "packageType": "app-store",
            "bundleIdentifier": "com.seimi.compass"
        }
    },
    "android": {
        "debug": {
            "keystore": ".compass.keystore",            
            "storePassword": "YourPasssword",
            "alias": "alias-compass"
        },
        "release": {
            "keystore": ".compass.prod.keystore",
            "storePassword": "YourPassword",
            "alias": "alias-compass"
        }
    },
    // custom options  
    "compass": {                                                        
        "android": {                                                      
            // path for android apk files 
            // should not change unless cordova changes that
            "path": "platforms/android/app/build/outputs/apk",                
            // debug and release have the properties 
            "debug": {                                                        
                // this is an optional appcenter app name
                "appcenterApp": "SEI-Meetings-and-Incentives/compass-android"   
            }
        },
        // ios options
        "ios": {                                                          
            // OSX keychain to use
            "keychain": "compass.keychain",                                   
            // keychain password
            "keychainPassword": "YourPassword",  
            // path for ios ipa files 
            // should not change unless cordova changes that
            "path": "platforms/ios/build/device",
            // debug and release have the properties 
            "debug": {                                                        
                // this is an optional appcenter app name
                "appcenterApp": "SEI-Meetings-and-Incentives/compass-ios"       
            },
            "release": {}
        },
        // appcenter distribution group required if appcenterApp is specified 
        // (assumes the same group name for all app binaries)
        "appcenterGroup": "Test"                                            
    }
```

The standard cordova options are described at:
- https://cordova.apache.org/docs/en/latest/guide/platforms/android/
- https://cordova.apache.org/docs/en/latest/guide/platforms/ios/

*Json files don't support comments, remove if copying this content.



## Building and running

There are a set of npm scripts prepared to build/run/emulate the app. All the scripts accept standard ionic command arguments separated by --, for exampe:

```
npm run emulate -- --livereload
```

#### Serve - build www folder and serve via http
```
npm run serve
```

### Emulator

#### Run emulator

It will run a script to select the emulator os and target.
```
npm run emulate 
```

#### Run emulator with livereload
```
npm run emulate -- --livereload
```


### Build

The command `npm run build` will build the solution with different options. 

By default, it will publish the app to appcenter, to skip publishing add `-- --skip-publishing`. To publish but not push the git tag to remote use `-- --skip-push`.

#### www folder
```
npm run build
```

#### android app
```
npm run build -- android
```

##### android app - production

```
npm run build -- android --prod --release
```

To specicy a keystore password that will override the one at `build/build.json`, run:
```
npm run build -- android --prod --release --password=MyPassword
```

####  ios app
```
npm run build -- ios --device
```

##### Build ios app - production
```
npm run build -- ios --prod --release
```

To specicy a keychain password that will override the one at `build/build.json`, run:
```
npm run build -- --prod --release --password=MyPassword
```


####  build ios and android
```
npm run build -- ios android --device
```

##### Build ios app - production
```
npm run build -- ios android --prod --release
```

To specicy a keystore/keychain password that will override the one at `build/build.json`, run:
```
npm run build -- ios android --prod --release --password=MyPassword
```

### More information

For more information on the ionic command options (accepted by those npm build scripts), please refer to Ionic documentation:
https://ionicframework.com/docs/cli/commands/build
https://ionicframework.com/docs/cli/commands/cordova-build
https://ionicframework.com/docs/cli/commands/cordova-emulate
https://ionicframework.com/docs/cli/commands/serve

### publishing without building

To publish the app to appcenter use the command `npm run publish`. To publish but not push the git tag to remote use `-- --skip-push`.

#### android
```
npm run publish -- android 
```

##### android production
```
npm run publish -- android --prod
```

#### ios
```
npm run publish -- android 
```

##### ios production
```
npm run publish -- android --prod
```

## Configuration

### Icon and Splashscreen

Set the files icon.png and splash.png inside the resources folder. It's very important that the format is png.

Run:

```
ionic cordova resources.
```

### Settings and ionic css variables

There is a folder src/config with the following files:
- settings.ts 
  - Configuration part of the old master_config/master_settings
  - Some of the config values (the immutable ones) are going to be moved here, as well on the settings service for the mutable properties.
  - The values are going to be moved from the old config files as we need them for features. This way we cleanup unused values by the end.
  -  The values will be renamed for a more standar naming convention.
  -  Some values will be removed, for example a_compass_version, now we using a cordova plugin for it.
- variables.scss
  - The ionic css variables
  - Mostly for colors, but for can be used for any other customizeable scss.
  - Color generator for generating the layered colors (tint/shade/contrast):
    - https://ionicframework.com/docs/theming/color-generator
    - Very useful tool
  - More information:
    - https://ionicframework.com/docs/theming/colors
    - https://ionicframework.com/docs/theming/basics#css-variables
- config.ts
  - This is the old file, it will be removed by the end of the project. It's there for reference only as I am commenting out things that are implemented on the new app.
- Other files are there for feature specific configuration.

### Angular Material

TODO: add documentation when setting up material styles.

### Assets

The images are on the assets folder for now, if needed later we might break that folder in subfolders. For now only the logo is there and this log is referenced at the settings.ts file described above.

### Welcome Page

There is a configurations file at src/config/welcome-page.config.ts and the config object is defined on WELCOME_PAGE_CONFIG.

#### The config object format

As defined on interface IWelcomePageConfig:

{
|                                        |                                           |                                 |                                                                                                                                                                                                                                |
| -------------------------------------- | ----------------------------------------- | ------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| background                             |                                           |                          string | Url of background image to use globally, can be overriden on an item basis                                                                                                                                                     |
| content: {                             |                                           |                                 | Content item to display over the background, can be overriden on an item basis                                                                                                                                                 |
|                                        | type                                      | 'image'<br/> 'text'<br/> 'html' |
|                                        | data                                      |                          string | The image path, text, or html                                                                                                                                                                                                  |
| }                                      |                                           |                                 |
| opacity:                               |                                           |           number <br/>0.......1 | The opacity for the background image. It can be overriden on an item basis.      <br/> Default = 1                                                                                                                             |
| classes:                               |                                           |                        string[] | An array of css classes to append to the item content, can be merged with the same property for each item.                                                                                                                     |
| styles:                                |                                           |                   {[index]:any} | A css styles object on ngStyle format to append to the item content, can be merged with the same property for each item (item styles take precedence). <br/> For more information visit: https://angular.io/api/common/NgStyle |
| items: [                               |                                           |                                 | An array of items to be rotaded on the welcome page.                                                                                                                                                                           |
| <p style='text-align: right;'>  { </p> |                                           |
|                                        | background:                               |                          string | Url of background image to use                                                                                                                                                                                                 |
|                                        | content: {                                |                                 | Content item to display over the background                                                                                                                                                                                    |
|                                        | <p style='text-align: right;'> type  </p> | 'image'<br/> 'text'<br/> 'html' |
|                                        | <p style='text-align: right;'> data </p>  |                          string | The image path, text, or html                                                                                                                                                                                                  |
|                                        | }                                         |                                 |
|                                        | opacity:                                  |           number <br/>0.......1 | The opacity for the background image, the default is 1. It can be overriden on an item basis. <br/> Default = 1                                                                                                                |
|                                        | classes: string[]                         |                        string[] | An array of css classes to append to the item content                                                                                                                                                                          |
|                                        | styles:                                   |                   {[index]:any} | A css styles object on ngStyle format to append to the item content} <br/> For more information visit: https://angular.io/api/common/NgStyle                                                                                   |
| <p style='text-align: right;'>  } </p> |                                           |                                 |
| ]                                      |                                           |                                 |
| speed:                                 |                                           |                          number | A numeric value to stay on each item <br/> Swiper format - more information on http://idangero.us/swiper/api/  <br/> Default = 3000                                                                                            |
}

#### Item configuration inheritance

The background, content and opacity properties can be specified on either the individual items as well as at the root of the WELCOME_PAGE_CONFIG object. The item setting takes precedence over the global setting. Also background and content are required properties and need to be set on the WELCOME_PAGE_CONFIG object if not existent on all the items.

The style and classes properties are concatenated, the styles on items take precedence over the styles defined at WELCOME_PAGE_CONFIG object. Both are optional.

### Menu

The items for the menu are defined by the property menuItems at `src/app/core/menu/menu.component.ts`.

The menuItems property is an array of items with following properties:
|            |                              |                                                                                                                                                |
| ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| icon       | string                       | the ionic icon to use                                                                                                                          |
| title      | string                       | the title to use                                                                                                                               |
| largeIcon? | boolean                      | use ionic large icon                                                                                                                           |
| route?     | string[]                     | route to activate on click                                                                                                                     |
| delay?     | number                       | delay for action, for some actions like login we might want to wait for displaying a modal to prevent the menu and modal animations to overlap |
| badge?     | Observable<string \| number> | an observable with a content for the item badge                                                                                                |
| class?     | string                       | css class for custom styling the item (use menu.component.scss)                                                                                |
| action?    | () => void                   | action to execute                                                                                                                              |
| isVisible? | Observable<boolean>          | an observable wrapping the item visibility status                                                                                              |


## Migration from seiCompass 1

### Plugin compatibility upgrade by phases

#### Installed by default by ionic

- cordova-plugin-whitelist

  - Ionic4 uses the same plugin by default
  - no native wrapper needed/available

- cordova-plugin-device

  - Ionic4 uses the same plugin by default
  - @ionic-native/device

- ionic-plugin-keyboard

  - upgrade to cordova-plugin-ionic-keyboard
  - @ionic-native/keyboard

- cordova-plugin-splashscreen

  - Ionic4 uses the same plugin by default
  - @ionic-native/splash-screen

- cordova-plugin-statusbar
  - Ionic4 uses the same plugin by default
  - @ionic-native/status-bar

#### Will not upgrade

- cordova-plugin-dialogs

  - use ion-alert instead as it has more flexibility on styling and it's the standard for that alert/confirm prompts.
  - @ionic-native/dialogs

- cordova-plugin-actionsheet

  - Use ion-action-sheet instead
  - @ionic-native/action-sheet

- cordova-plugin-compat

  - deprecated

- cordova-plugin-inappbrowser": "^3.0.0",
  - It seems that this is only used for launching the system browser, I will use if it's needed as I develop the features.

#### Maybe we will need later

- cordova-plugin-androidx & cordova-plugin-androidx-adapter
  - I will test on newer android platform. If we have some other plugin that depends on it we will install it
  - It worked without it, let's see my guess it's that some other plugin might require down the road
  
#### Phase A2

- cordova-plugin-vibration,

  - @ionic-native/vibration

- phonegap-plugin-push

  - This is on package.json but I can't find calls to it, the push registration in the code calls Firebase plugin (that's not on package.json), but either way if we using firebase for messaging, we should stick to the updated firebase-x plugin.
  - This will be replaced by cordova-plugin-firebasex
  - @ionic-native/firebase-x
  - I also see the event handling of cloud:push:notification
  - I suggest that we stick to one method if possible, firebase-x plugin
  - **Question**: are my assumptions correct? or are we using the push plugin for something I am not seeing on compass1?

#### Phase A3

- cordova-plugin-camera

  - @ionic-native/camera

- cordova-plugin-image-picker

  - @ionic-native/image-picker

- cordova-plugin-file-transfer
  - @ionic-native/file-transfer

#### Phase A5

- cordova-plugin-calendar

  - @ionic-native/calendar

- phonegap-plugin-barcodescanner
  - Use same plugin
  - @ionic-native/barcode-scanner
  - example: https://edupala.com/ionic-qr-code-scanner-and-generator/

#### QR Code generator

- I am not clear on slides where this is used.
- On the old code this is used in a directive only used on the profile-badge.html template. I could not find that screen on the presentation.
- Currently we are using
  monospaced.qrcode
- Now we will use ngx-qrcode2:
  - https://github.com/techiediaries/ngx-qrcode
- cordova-plugin-qrscanner

  - **Question**: are my assumptions from the old app correct?

## Tasks

### Phase A1

- Initial setup: create app, menu structucture, constants, environments, build process, etc.
- Http Interceptors, error handling, core module

  - **Question**: What do you mean by "Setup an area for general configuration." from the presentation? I am assuming this is what I described as the config/resource/assets folders, correct?

- Colors and style: setup the default scss files for setting ionic style variables and explain it on this file. Make sure it worked on android and ios.

- Icon and splash: update the icon and splash, and setup a method for updating it:
  - use ionic commands for that

### Phase A2

- Welcome screen
  - create a folder for rotating images
  - create a config file for rotating images
  - implement the image rotation

- Login screen
  - **Pre-req**: test usernames/passwords, APIs for Login, subscribe, forgotpassword, logout
  - Core components:
    - authentication
    - token
    - Authentication guard
    - Implement authentication logic on the interceptors
- Push notification registration
  - I am assuming we will use FCM
  - Configure FCM - I am assuming I will have access to that account so I can set it up and test. Correct?
  - Setup FCM plugin 
  - Define global patterns to handle push notifications - likely we will have one service for all of that and a one interface for each type of message.
  - Implement push registration
  - Implement some test push notification handling
  - It used to be that for fcm offilne messages we need to implement a script/page to do it, I am not 100% that this still the case. How/when do you currently send push notifications?
  - Test the implementation on both android and ios - both online - offline
- Menu
  - migrate several master_config and master_settings to a service or constants file. Depending on each setting being mutable or not.
  - **Question**: Features that use $root.badges.* (like $root.badges.news.total) will be done later as we add the state management for each feature, I will add them as commented code with the TODO: preffix to it so we can revisit later as we add the functionalities (posts, events, chats, etc...). I want to make sure we that's ok with SEI.
- Other tasks (Core)
  - Add plugins required
  - Setup patterns for http caching
  - More global styling will be needed as we will start building forms.
  - Go deeper into the old layout controller and define the best architecture for the things that are there as a lot of them will be already migrated during this phase.
  - Setup an appcenter distribution for the builds.
  - Setup auto-updates use appcenter code-push. I recommend to have that ability on the app it can be very handy for hot-fixes in production, and it's very useful when testing the app features.
  - Define how we will handle errors, both http and non-http. Implement global error handling (some of the http part is already in place from phase A1).

- If we have extra time by the end:
  - Create a hidden screen/component that will display the app version/build information. That would be useful when testing the app (especially if we are using auto-updates).
  - We can also implement a debug mode option to allow more detailed error messages when troubleshooting. Use the screen above for enable disable debug mode
  - Add the ability to switch between environments inside the app (maybe using the screen above)
    - the environment will contain api urls, fcm address, updates address for the each version, the angular environments will be used to define the default environment when the app starts.
    - So you can connect a production app to a dev environment, or vice-versa, this can be very important when troubleshooting production issues. 
  - Start planning a strategy for the app state management

### Phase A3

Not done on phase A2:
- Auto updates
- Finish setting-up firebase for ios (waiting for key)

A3 Planning:
  styles
  components architecture 

A3 development:
service layer
configuartion properties
routes 
modular components for posts/comments/promoted posts

Testing
Documentation
Android and iOS testing


- If we have extra time by the end:
- Create a hidden screen/component that will display the app version/build information. That would be useful when testing the app (especially if we are using auto-updates).
  - We can also implement a debug mode option to allow more detailed error messages when troubleshooting. Use the screen above for enable disable debug mode
  - Add the ability to switch between environments inside the app (maybe using the screen above)
    - the environment will contain api urls, fcm address, updates address for the each version, the angular environments will be used to define the default environment when the app starts.
    - So you can connect a production app to a dev environment, or vice-versa, this can be very important when troubleshooting production issues. 
  
questions: 
I am assuming post badges will show the number of underead posts, not the total posts, correct?
TODO: estimate phase