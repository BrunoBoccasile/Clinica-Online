import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({"projectId":"tp-clinica-online-e58f0","appId":"1:148186962366:web:de2df11827aa3602c181ef","storageBucket":"tp-clinica-online-e58f0.appspot.com","apiKey":"AIzaSyBJtKrLY8S0BOLk38rEEeNTQXen4KLTZwk","authDomain":"tp-clinica-online-e58f0.firebaseapp.com","messagingSenderId":"148186962366"})), 
    provideAuth(() => getAuth()),
     provideFirestore(() => getFirestore()), 
     provideStorage(() => getStorage())
    ]
};
