import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import { IonFormErrorMessagesModule } from 'ion-form-error-messages';
import { CacheModule } from 'ionic-cache';
import { AvatarModule } from 'ngx-avatar';
import { HeaderComponent } from './header/header.component';
import { RequestInterceptor } from './interceptors/request.interceptor';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { MenuComponent } from './menu/menu.component';
import { ParticipantAvatarComponent } from './participant-avatar/participant-avatar/participant-avatar.component';

const components = [HeaderComponent, MenuComponent, ParticipantAvatarComponent];
const modalComponents = [LoginComponent];

@NgModule({
    imports: [
        AvatarModule,
        CacheModule.forRoot(),
        CommonModule,
        HttpClientModule,
        MaterialModule,
        IonFormErrorMessagesModule,
        IonicModule,
        PipesModule,
        ReactiveFormsModule
    ],
    entryComponents: modalComponents,
    exports: [...components, ...modalComponents, AvatarModule, MaterialModule],
    declarations: [...components, ...modalComponents],
    providers: [
        AppVersion,
        Device,
        SplashScreen,
        StatusBar,
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true }
    ]
})
export class CoreModule {}
