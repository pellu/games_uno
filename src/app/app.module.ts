import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorage, AngularFireStorageModule } from 'angularfire2/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';

// PAGES
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { TictactoePage } from '../pages/tictactoe/tictactoe';
import { InvitationsPage } from '../pages/invitations/invitations';
import { SearchTictactoePlayersPage } from '../pages/search-tictactoe-players/search-tictactoe-players'
import { MemoryPage } from '../pages/memory/memory'; 
import { MemoryCreatePage } from '../pages/memory-create/memory-create';
import { HangmanPage } from '../pages/hangman/hangman'

// GLOBAL VARIABLES
import { User } from '../providers/user'
import { FIREBASE_CONFIG } from '../providers/globals';

// PROVIDERS
import { AlertProvider } from '../providers/alert.provider';
import { LoginProvider } from '../providers/login.provider';
import { CameraProvider } from '../providers/camera.provider';
import { Models } from '../models/models';
import { MemoryProvider } from '../providers/memory.provider';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TictactoePage,
    InvitationsPage,
    SearchTictactoePlayersPage,
    MemoryPage,
    MemoryCreatePage,
    HangmanPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,

    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TictactoePage,
    InvitationsPage,
    SearchTictactoePlayersPage,
    MemoryPage,
    MemoryCreatePage,
    HangmanPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AlertProvider,
    LoginProvider,
    MemoryProvider,
    User,
    AngularFirestore,
    Camera,
    CameraProvider,
    Models
  ]
})
export class AppModule {}
