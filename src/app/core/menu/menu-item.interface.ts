import { Observable } from 'rxjs';

export interface IMenuItem {
    icon: string;
    title: string;
    largeIcon?: boolean;
    route?: string[];
    delay?: number;
    badge?: Observable<string | number>;
    class?: string;
    action?: () => void;
    isVisible?: Observable<boolean>;
    showForAnonymous?: boolean;
}
