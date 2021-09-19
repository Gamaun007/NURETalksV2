export interface InternationalizationConfiguration {
  defaultLanguage: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface ConfigurationFile {
  firebase?: FirebaseConfig;
  internationalization: InternationalizationConfiguration;
  fireStoreEndpoints: string[];
  signInRedirectUrl: string;
}
