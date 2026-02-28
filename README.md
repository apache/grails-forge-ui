# Grails Application Forge UI

[![Build Status](https://github.com/grails/grails-forge-ui/workflows/Publish/badge.svg)](https://github.com/grails/grails-forge-ui/actions)

This project builds the [Grails Application Forge UI](https://start.grails.org).


## To build the site for CI run:

```bash
./gradlew build --console=plain
```

In the new version of npm (v7), by default, npm install will fail when it encounters conflicting peerDependencies. You may see the following error with `build` command:

```agsl
> Task :npmInstall
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: react-materialize@3.9.8
npm ERR! Found: react@17.0.2
npm ERR! node_modules/react
npm ERR!   react@"^17.0.2" from the root project
npm ERR!   peer react@"^16.8.0 || ^17.0.0" from @material-ui/core@4.11.4
npm ERR!   node_modules/@material-ui/core
npm ERR!     @material-ui/core@"^4.11.4" from the root project
npm ERR!     peer @material-ui/core@"^4.0.0" from @material-ui/icons@4.11.2
npm ERR!     node_modules/@material-ui/icons
npm ERR!       @material-ui/icons@"^4.11.2" from the root project
npm ERR!     1 more (@material-ui/lab)
npm ERR!   12 more (@material-ui/icons, @material-ui/lab, ...)
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^16.12.0" from react-materialize@3.9.8
npm ERR! node_modules/react-materialize
npm ERR!   react-materialize@"^3.9.8" from the root project
npm ERR! 
npm ERR! Conflicting peer dependency: react@16.14.0
npm ERR! node_modules/react
npm ERR!   peer react@"^16.12.0" from react-materialize@3.9.8
npm ERR!   node_modules/react-materialize
npm ERR!     react-materialize@"^3.9.8" from the root project
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR! 
npm ERR! See /Users/behl/.npm/eresolve-report.txt for a full report.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/behl/.npm/_logs/2022-12-30T16_02_08_877Z-debug-0.log

```
This happens due to latest version of Node.js, then you might need to set flag`--legacy-peer-deps` with `npm install` command.


## For local development mimicking production launch site:

- To bypass CORS restrictions, Launch the Local Version / Proxy Server

```
cd ./dev-proxy-server
npm run start
```

- Start the dev build of the site

```
cd ./app/launch/
npm run start:local
```

## Running a Grails Forge API locally to dev against

If you want to run against a version of the starter api [Grails Starter Api](https://github.com/apache/grails-core/blob/-/grails-forge)

Outside of this project pull down that repo

```bash
git clone git@github.com:apache/grails-core.git
cd grails-core/grails-forge
export CORS_ALLOWED_ORIGIN=http://localhost:3000
./gradlew grails-forge-web-netty:run
```

Then start up a version server to provide that instance

```
cd ./dev-proxy-server
npm run start:starter
```

## Updating The Version feed

You can find the version feed file at [./app/launch/public/grails-version-feed.json](./app/launch/public/grails-version-feed.json). It must be in valid JSON format, so beware of these gotyas!

**Keys must be quoted**

- GOOD

  ```
  {
      "key": "RELEASE",
      "baseUrl": "https://start.grails.org",
      "order": 0
  }
  ```

- BAD

  ```
  {
      key: "RELEASE",
      baseUrl: "https://start.grails.org",
      order: 0
  }
  ```

**No trailing comma**

- GOOD

  ```
  {
      "key": "RELEASE",
      ...
  },
  {
      "key": "NEXT",
      ...
  }
  ```

- BAD

  ```
  {
      "key": "RELEASE",
      ...
  },
  {
      "key": "NEXT",
      ...
  },
  ```
## Running the React app without changing grails-version-feed.json
In dev-proxy-server/ there is a run.command file that will expose the proxies of the grails version feed on port 8088.
When starting the React app under app/launch use the command:
```shell
npm run start:local
```
This will run the React app while retargetig the version feed for it to localhost:8088.