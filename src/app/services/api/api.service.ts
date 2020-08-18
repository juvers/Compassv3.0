import { Injectable } from '@angular/core';
import { SettingsService } from '@services/settings/settings.service';
import { CacheService } from 'ionic-cache';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

export interface ICacheOptions {
    cache?: boolean;
    refresh?: boolean;
}
export interface IHttpOptions {
    responseType?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    get root() {
        const api = this.settings.environment?.api ? this.settings.environment.api : '';
        return api.endsWith('/') ? api.slice(0, -1) : api;
    }
    constructor(private cache: CacheService, private http: HttpClient, private settings: SettingsService) {}

    get<T>(
        path: string,
        options: {
            params?: HttpParams | { [param: string]: string | string[] };
            cacheOptions?: ICacheOptions;
            isTextResponse?: boolean;
        } = {}
    ) {
        const url = `${this.root}/${path}`;

        let request: Observable<T>;
        if (options.isTextResponse) {
            request = this.http
                .get(url, { params: options.params, responseType: 'text' })
                .pipe(map((result: any) => result as T));
        } else {
            request = this.http.get<T>(url, options.params ? { params: options.params } : undefined);
        }
        if (options.cacheOptions?.cache) {
            const observable = this.cache.loadFromObservable<T>(url, request);
            if (options.cacheOptions.refresh) {
                return from(this.cache.removeItem(url)).pipe(flatMap(() => observable));
            } else {
                return observable;
            }
        } else {
            return request;
        }
    }

    post<T>(path: string, body, options: { cacheOptions?: ICacheOptions; isTextResponse?: boolean } = {}) {
        const url = `${this.root}/${path}`;

        let request: Observable<T>;
        // let httpOptions;
        if (options.isTextResponse) {
            request = this.http.post(url, body, { responseType: 'text' }).pipe(map((result: any) => result as T));
        } else {
            request = this.http.post<T>(url, body);
        }

        if (options?.cacheOptions?.cache) {
            const observable = this.cache.loadFromObservable<T>(url, request);
            if (options.cacheOptions.refresh) {
                return from(this.cache.removeItem(url)).pipe(flatMap(() => observable));
            } else {
                return observable;
            }
        } else {
            return request;
        }
    }
}
