import { AppRoutes, AuthRoutes } from './../app/core/constants/routes';
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
  configName: 'config.json',
};
