import { IWelcomePageConfig } from '@modules/welcome/welcome.config.interface';

export const WELCOME_PAGE_CONFIG: IWelcomePageConfig = {
    items: [
        { background: 'assets/slides/slide-1.jpg' },
        { background: 'assets/slides/slide-2.jpg' },
        { background: 'assets/slides/slide-3.jpg' },
        { background: 'assets/slides/slide-4.jpg' }
    ],
    content: {
        type: 'image',
        data: 'assets/basic-long-nobackground.png'
    },
    speed: 2000,
    opacity: 0.3
};

/**
 * Above is a similar config as seiCompass1, below is an example config showing more advanced options for the welcome page config.
 */
// export const WELCOME_PAGE_CONFIG: IWelcomePageConfig = {
//     items: [
//         { background: 'assets/slides/slide-1.jpg' },
//         { background: 'assets/slides/slide-2.jpg' },
//         {
//             background: 'assets/slides/slide-3.jpg',
//             content: { type: 'text', data: 'Test text' }
//         },
//         {
//             background: 'assets/slides/slide-3.jpg',
//             content: {
//                 type: 'text',
//                 data: 'Test text styles and background opacity'
//             },
//             style: { color: 'black', 'text-shadow': '2px 2px 5px #00F' },
//             opacity: 1
//         },
//         { background: 'assets/slides/slide-4.jpg', content: { type: 'html', data: '<h1>Test</h1> Html' } }
//     ],
//     content: {
//         type: 'image',
//         data: 'assets/basic-long-nobackground.png'
//     },
//     speed: 2000,
//     style: { color: 'red' },
//     opacity: 0.3
// };
