import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { AuthenticationGuard } from '@core/guards/authentication.guard';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { Device } from '@ionic-native/device/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { SettingsService } from '@services/settings/settings.service';
import { IonModalLauncherModule } from 'ion-modal-launcher';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from 'src/environments/environment';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        environment.production ? [] : AkitaNgDevtools,
        AkitaNgRouterStoreModule,
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        CoreModule,
        IonicModule.forRoot({
            mode: 'md'
        }),
        IonicStorageModule.forRoot(),
        IonModalLauncherModule
    ],
    providers: [
        AppVersion,
        Device,
        FirebaseX,
        SplashScreen,
        StatusBar,
        Camera,
        File,
        ImagePicker,
        FileTransfer,
        PhotoViewer,
        LaunchNavigator,
        Vibration,
        AuthenticationGuard,
        InAppBrowser,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: NG_ENTITY_SERVICE_CONFIG,
            useValue: {
                baseUrl: SettingsService.environment?.api
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
