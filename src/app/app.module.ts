import { BrowserModule } from '@angular/platform-browser';
import {EmojiPickerComponentModule} from "../components/emoji-picker/emoji-picker.module";
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from "@angular/http";
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { SwingModule } from 'angular2-swing';


import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Camera } from '@ionic-native/camera';
import { Transfer} from '@ionic-native/transfer';

import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { config } from './app.firebaseconfig';
import { EmojiPickerComponent } from "../components/emoji-picker/emoji-picker";
import { ImageCropperModule } from "ng2-img-cropper/index";



import { SplashGroupChatPage } from '../pages/splash-group-chat/splash-group-chat';
import { GetStartedPage } from '../pages/get-started/get-started';
import { SignEmailPage } from '../pages/sign-email/sign-email';
import { SignUpEPage } from '../pages/sign-up-e/sign-up-e';
import { MyProfilePage } from '../pages/my-profile/my-profile';
import { MeetKinkStersPage } from '../pages/meet-kink-sters/meet-kink-sters';
import { MessagesPage } from '../pages/messages/messages';
import { DungeonFinderWalkthorughPage } from '../pages/dungeon-finder-walkthorugh/dungeon-finder-walkthorugh';
import { MenuSidePage } from '../pages/menu-side/menu-side';
import { SettingsPage } from '../pages/settings/settings';
import { ItsAMatchPage } from '../pages/its-a-match/its-a-match';
import { DungeonListingPage } from '../pages/dungeon-listing/dungeon-listing';
import { WriteAReviewPage } from '../pages/write-a-review/write-a-review';
import { Chat } from '../pages/chat/chat';
import { DungeonFinderPage } from '../pages/dungeon-finder/dungeon-finder';
import { AddUserToGroupPage } from '../pages/add-user-to-group/add-user-to-group';
import { ChatGroupPage } from '../pages/chat-group/chat-group';
import { GroupsPage } from '../pages/groups/groups';
import { AddyourdungeonPage } from '../pages/addyourdungeon/addyourdungeon';
import { DungeonmessagesPage } from '../pages/dungeonmessages/dungeonmessages';
import { BuddychatPage } from '../pages/buddychat/buddychat';
import { PicturemodalPage } from '../pages/picturemodal/picturemodal';
import { MydungeonlistsPage } from '../pages/mydungeonlists/mydungeonlists';
import { EditbiomodalPage } from '../pages/editbiomodal/editbiomodal';
import { CroppingPage } from '../pages/cropping/cropping';
import { PurchasepayPage } from '../pages/purchasepay/purchasepay';


import { RelativeTime } from "../pipes/relative-time";
import { EmojiProvider } from '../providers/emoji';
import { ChatService, ChatMessage, UserInfo } from "../providers/chat-service";
import { FirstproviderProvider } from '../providers/firstprovider/firstprovider';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { FireauthProvider } from '../providers/fireauth/fireauth';
import { ImageHndlerProvider } from '../providers/image-hndler/image-hndler';
import { RequestsProvider } from '../providers/requests/requests';
import { ChatProvider } from '../providers/chat/chat';
import { NotificationProvider } from '../providers/notification/notification';
import { PayPal } from '@ionic-native/paypal';






@NgModule({
  declarations: [
    MyApp,
    SplashGroupChatPage,
    GetStartedPage,
    SignEmailPage,
    SignUpEPage,
    MyProfilePage,
    MeetKinkStersPage,
    MessagesPage,
    DungeonFinderWalkthorughPage,
    MenuSidePage,
    SettingsPage,
    ItsAMatchPage,
    DungeonListingPage,
    WriteAReviewPage,
    Chat,
    DungeonFinderPage,
    AddUserToGroupPage,
    ChatGroupPage,
    EmojiPickerComponent,
    AddyourdungeonPage,
    DungeonmessagesPage,
    BuddychatPage,
    PicturemodalPage,
    MydungeonlistsPage,
    EditbiomodalPage,
    CroppingPage,
    PurchasepayPage,



    RelativeTime,
    GroupsPage,
    


  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SwingModule,
    ImageCropperModule,
    AngularFireModule.initializeApp(config),
    
    
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EmojiPickerComponent,
    MyApp,
    SplashGroupChatPage,
    GetStartedPage,
    SignEmailPage,
    SignUpEPage,
    MyProfilePage,
    MeetKinkStersPage,
    MessagesPage,
    DungeonFinderWalkthorughPage,
    MenuSidePage,
    SettingsPage,
    ItsAMatchPage,
    DungeonListingPage,
    WriteAReviewPage,
    Chat,
    DungeonFinderPage,
    AddUserToGroupPage,
    ChatGroupPage,
    GroupsPage,
    AddyourdungeonPage,
    DungeonmessagesPage,
    BuddychatPage,
    PicturemodalPage,
    MydungeonlistsPage,
    EditbiomodalPage,
    CroppingPage,
    PurchasepayPage

    
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmojiProvider,
    ChatService,
    ChatMessage,
    UserInfo,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    FirstproviderProvider,
    Geolocation,
    NativeGeocoder,
    BackgroundGeolocation,
    LocationTrackerProvider,
    FireauthProvider,
    AngularFireAuth,
    ImageHndlerProvider,
    Camera, 
    PayPal,

    
    
    Transfer,
    RequestsProvider,
    ChatProvider,
    NotificationProvider,

    
   

  
  ]
})
export class AppModule {}

