// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAEkS5Heb7Hv0JbmOF9_VlhkCl64FhGyIo',
    authDomain: 'apartment-price-tracker.firebaseapp.com',
    databaseURL: 'https://apartment-price-tracker.firebaseio.com',
    storageBucket: 'apartment-price-tracker.appspot.com',
  }
};
