# Website Mobile site

## Frontend application with server-side rendering.

Node instance runs on port `1337`.
Webpack dev server runs on port `4241`

This project uses `yarn.lock`. Best to use [`yarn`](https://yarnpkg.com/en/) with this project.

### Requirements
 - `wp-dreamlines` and `website-backend` should be running for the project.

### Tech Stack

 - [Typescript](https://www.typescriptlang.org/docs/tutorial.html)
 - [NodeJS](https://nodejs.org/en) - for server side rendering
 - [ExpressJs](http://expressjs.com/en/4x/api.html) - for basic routing
 - [Universal-router](https://github.com/kriasoft/universal-router) - for universal app routing
 - [React](https://github.com/facebook/react) - frontend view framework
 - [Redux](https://github.com/reactjs/redux) - frontend ui logic framework
 - [Jest](https://facebook.github.io/jest/) - testing framework

### Quickstart (run app in development mode):
```bash
yarn
yarn watch
# Browser will automatically open web-page on port 4241

```
### Build app for production usage
```bash
npm run build:prod
```
### Testing:


```bash
yarn run test:jest
```

To watch,

```bash
yarn run test:jest -- --watch
```

To run all the tests with source linting

```bash
yarn run test
```

### Code style

 - use 4 spaces intendation for ts and scss files
 - do not write js functions in jsx templates directly
 - use build-in inline styles for react components. Fallback to
   scss only if it not possible to use inline styles. scss file name should be the same as component file name   
#### Notes

- two client build types are supported (local and production)
- css assets are bundled with js bundle for local environment. For production environment css/fonts are extracted in `assets/dir` folder
- `async/await` syntax is not supported in universal part of app to reduce bundle size


|VAR	                                |For?  	                                                                                |Example / Values   	                                                |
|---	                                |---	                                                                                |---	                                                                |
|API_HOST	                            |defines REST API host                                          | "http://website-backend-dreamlines-de.stagev1internal.dreamlines.de"|
