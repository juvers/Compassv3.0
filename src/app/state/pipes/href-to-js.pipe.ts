import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// This is the same filter code as the old app adapted to a pipe
@Pipe({
    name: 'hrefToJs'
})
export class HrefToJsPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(value: any, ...args: any[]): any {
        let tempText = value;
        if (tempText == null) {
            return tempText;
        } // Skip work if null

        // Potentially better version
        const regExNewLineEntity = /(?:&#10;)/gim;

        tempText = tempText.replace(regExNewLineEntity, ' <br />&#10;');
        // console.log("After Sanitize: " + tempText);
        // http://, https://, ftp://
        const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        const regex = /href="([\S]+)"/g;
        // Patterns
        const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;
        const phoneNumberPattern = /((\d[\d\-.]*){9,})/g;
        const compassPattern = /\b(?:compass):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        const navigatePattern = /\b(?:navigate):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
        const imagePattern = /\b(?:image):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim; // for http image
        const imagesPattern = /\b(?:images):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim; // for https
        const ytPattern = /\b(?:yt):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim; // for youtube embed
        const buttonPattern = /\b(?:button):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim; // for http buttons external
        const goPattern = /\b(?:go):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim; // for local buttons
        const downloadPattern = /\b(?:download):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim; // for Download buttons
        // Regular Expressions
        const regexEmail = /mailto="([\S]+)"/g;
        const regexPhone = /callto="([\S]+)"/g;
        const regexCompass = /compassto="compass:\/\/([\S]+)"/g;
        const regexNavigate = /navigateto="navigate:\/\/([\S]+)"/g;
        const regexImage = /imageto="image:\/\/([\S]+)"/g;
        const regexImages = /imagesto="images:\/\/([\S]+)"/g; // for https
        const regexYT = /ytto="yt:\/\/([\S]+)"/g; // for youtube embed
        const regexButton = /buttonto="button:\/\/([\S]+)"/g; // for external button
        const regexGo = /goto="go:\/\/([\S]+)"/g; // for local button
        const regexDownload = /downloadto="download:\/\/([\S]+)"/g; // for download button
        // Initial Conversions
        tempText = tempText.replace(urlPattern, '<a href="$&" class="icon-left ion-earth"> $&</a>');
        tempText = tempText.replace(emailAddressPattern, '<a mailto="mailto:$&" class="icon-left ion-email"> $&</a>');
        tempText = tempText.replace(
            phoneNumberPattern,
            '<a callto="tel://$1" class="icon-left ion-android-call"> $&</a>'
        );
        tempText = tempText.replace(compassPattern, '<a compassto="$&" class="icon-left ion-link"> $&</a>');

        tempText = tempText.replace(imagePattern, '<img imageto="$&" style="max-width: 100%; display: block;">');
        tempText = tempText.replace(imagesPattern, '<img imagesto="$&" style="max-width: 100%; display: block;">');
        tempText = tempText.replace(
            ytPattern,
            '<div class="embed-video-container"><iframe ytto="$&" frameborder="0" width="560" height="315"></iframe></div>'
        );
        tempText = tempText.replace(
            buttonPattern,
            '<div><a buttonto="$&" class="button button-full button-positive icon icon-right ion-arrow-right-b">Visit </a></div>'
        );
        tempText = tempText.replace(
            goPattern,
            '<div><a goto="$&" class="button button-full button-positive icon icon-right ion-arrow-right-b">Go </a></div>'
        );
        tempText = tempText.replace(
            downloadPattern,
            '<div><a downloadto="$&" class="button button-full button-assertive icon icon-right ion-arrow-right-b">Download </a></div>'
        );
        // Final Conversions
        let newString = tempText.replace(regex, `onClick=\"window.open('$1', '_blank', 'location=yes')\"`);
        newString = newString.replace(regexEmail, `onClick=\"window.open('$1', '_system', 'location=yes')\"`);
        newString = newString.replace(regexPhone, `onClick=\"window.open('$1', '_system', 'location=yes')\"`);
        newString = newString.replace(regexCompass, `href='#$1'`);
        newString = newString.replace(regexImage, `src='http://$1'`);
        newString = newString.replace(regexImages, `src='https://$1'`); // for https
        newString = newString.replace(regexYT, `src='https://www.youtube.com/embed/$1?rel=0&modestbranding=1'`); // for youtube embed
        newString = newString.replace(regexButton, `onClick=\"window.open('http://$1', '_system', 'location=yes')\"`);
        newString = newString.replace(regexGo, `href='#$1'`);
        newString = newString.replace(regexDownload, `onClick=\"window.open('http://$1', '_system', 'location=yes')\"`);

        return this.sanitizer.bypassSecurityTrustHtml(newString);
    }
}
