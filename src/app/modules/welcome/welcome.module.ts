import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { IonicModule } from '@ionic/angular';
import { WelcomePage } from './welcome.page';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: WelcomePage
            }
        ])
    ],
    declarations: [WelcomePage]
})
export class WelcomePageModule {}
