import { EntityState, EntityStore, getIDType, getEntityType, QueryEntity } from '@datorama/akita';
import { HttpConfig, Msg, NgEntityService, NgEntityServiceParams } from '@datorama/akita-ng-entity-service';
import { SettingsService } from '@services/settings/settings.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DefaultObjectMapper } from '@core/default-object-mapper.class';

export class SeiEntityService<
    S extends EntityState = any,
    EntityType = getEntityType<S>,
    IDType = getIDType<S>
> extends NgEntityService<S> {
    items$ = this.query.selectAll();
    listUrl: string;
    loaders = this.loader.loadersFor(this.store.config?.name);

    constructor(
        public query: QueryEntity<S, EntityType, IDType>,
        protected store: EntityStore<S>,
        listUrl?: string,
        private type?: new () => EntityType,
        config?: NgEntityServiceParams
    ) {
        super(store, config);
        if (listUrl) {
            this.listUrl = `${SettingsService.api}/${listUrl}`;
        }
    }

    load(
        id?: getIDType<S>,
        config?: HttpConfig & {
            append?: boolean;
        } & Msg & { refresh?: boolean }
    ): Observable<unknown> {
        if (!config) {
            config = {};
        }

        if (config.refresh) {
            this.store.remove(id);
        }
        if (!config.mapResponseFn && this.type) {
            config.mapResponseFn = response => DefaultObjectMapper.map(response, this.type);
        }

        if (!id) {
            if (!config.url && this.listUrl) {
                config.url = this.listUrl;
            }
            this.store.setLoading(true);
            return this.get(config).pipe(
                tap(
                    () => this.store.setLoading(false),
                    () => this.store.setLoading(false)
                )
            );
        } else {
            return this.query.hasEntity(id) ? this.query.selectEntity(id) : this.get(id, config);
        }
    }

    select(id: IDType) {
        return this.query.selectEntity(id);
    }
}
