import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ringoffire-4a7f4',
          appId: '1:919331654638:web:95e420abce9c1262fe1cff',
          storageBucket: 'ringoffire-4a7f4.appspot.com',
          apiKey: 'AIzaSyBErW2DP_ZjMenwmUd4ZQ7RdFreqMJ5mqU',
          authDomain: 'ringoffire-4a7f4.firebaseapp.com',
          messagingSenderId: '919331654638',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
