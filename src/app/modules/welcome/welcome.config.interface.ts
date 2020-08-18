type opacityType = 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
export interface IWelcomePageItem {
    background?: string;
    content?: {
        data: string;
        type: 'image' | 'text' | 'html';
    };
    classes?: string[];
    style?: { [key: string]: any };
    opacity?: opacityType;
}

export interface IWelcomePageConfig extends IWelcomePageItem {
    items: IWelcomePageItem[];
    classes?: string[];
    style?: { [key: string]: any };
    speed?: number;
}
