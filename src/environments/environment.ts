import { AppRoutes, AuthRoutes } from './../app/core/constants/routes';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ConfigurationFile } from 'src/app/core/models';

const config: ConfigurationFile = {
  internationalization: {
    defaultLanguage: 'en-US',
  },
  firebase: {
    apiKey: 'AIzaSyBRdXGIx4YHSAZj9DSTOpaqEKvCm_j1njw',
    authDomain: 'nure-talks.firebaseapp.com',
    databaseURL: 'https://nure-talks.firebaseio.com',
    projectId: 'nure-talks',
    storageBucket: 'nure-talks.appspot.com',
    messagingSenderId: '668504499478',
    appId: '1:668504499478:web:e770c809d58d1f4b839c37',
    measurementId: 'G-Y1D15N9FJE',
  },
  signInRedirectUrl: `http://localhost:4200/${AppRoutes.Auth}/${AuthRoutes.EmailCallback}`,
  fireStoreEndpoints: [],
};

export const environment = {
  production: false,
  config,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
