import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';
import { ScanPage } from '../pages/scan/scan';
import { ScanResultPage } from '../pages/scan-result/scan-result';
import { Api } from '../providers/api';
import { User } from '../providers/user';
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { AlertProvider } from '../providers/alert/alert';
import { TabsPage } from '../pages/tabs/tabs';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { EmpresasPage } from '../pages/empresas/empresas';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus'; // We'll install this in the next section
import { RegisterPage } from '../pages/register/register';

const firebaseConfig = {
  apiKey: "AIzaSyBlw4UhthCXxjD7gZxdeJGkvBNZEV33mYQ",
  authDomain: "simplepassword-89a27.firebaseapp.com",
  databaseURL: "https://simplepassword-89a27.firebaseio.com",
  projectId: "simplepassword-89a27",
  storageBucket: "simplepassword-89a27.appspot.com",
  messagingSenderId: "370145099892"
}
firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    EventListPage,
    LoginPage,
    ScanPage,
    ScanResultPage,
    TabsPage,
    HomePage,
    ContactPage,
    EmpresasPage,
    RegisterPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventListPage,
    LoginPage,
    TabsPage,
    ScanPage,
    ScanResultPage,
    EmpresasPage,
    HomePage,
    ContactPage,
    RegisterPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    Api,
    User,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    AlertProvider,
    GooglePlus
  ]
})
export class AppModule { }
