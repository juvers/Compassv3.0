import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableAkitaProdMode, persistState } from '@datorama/akita';
import { User } from '@state/user/user.model';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableAkitaProdMode();
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.log(err));
