import { Injectable } from '@angular/core';
import { ENVIRONMENTS } from '@config/environments.config';
import { environment as ANGULAR_ENVIRONMENT } from 'src/environments/environment';
import { IEnvironment } from '@interfaces/environment.interface';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    static get api() {
        const api = SettingsService.environment?.api ? SettingsService.environment.api : '';
        return api.endsWith('/') ? api.slice(0, -1) : api;
    }
    static get defaultEnvironment() {
        if (ANGULAR_ENVIRONMENT.production) {
            return ENVIRONMENTS.production;
        } else if (ANGULAR_ENVIRONMENT.mock) {
            return ENVIRONMENTS.mock;
        } else {
            return ENVIRONMENTS.development;
        }
    }
    static environment: IEnvironment = SettingsService.defaultEnvironment;

    internetConnected = true;

    get defaultEnvironment() {
        return SettingsService.defaultEnvironment;
    }

    get environment() {
        return SettingsService.environment;
    }
    get environments() {
        return ENVIRONMENTS;
    }

    constructor() {}
}
