import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { LoaderService } from '@services/loader/loader.service';
import { SETTINGS } from '@config/settings';
import { SettingsService } from '@services/settings/settings.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private options = {
        maximumImagesCount: 5,
        width: 2100,
        height: 2100,
        quality: 100
    };

    constructor(
        private inAppBrowser: InAppBrowser,
        private fileTransfer: FileTransfer,
        private imagePicker: ImagePicker,
        private loader: LoaderService,
        private settings: SettingsService,
        private platform: Platform
    ) {}

    /**
     * @description
     * Image download.
     */
    download(image: string) {
        if (this.platform.is('cordova')) {
            this.inAppBrowser.create(image, '_system');
        } else {
            window.open(image, '_system', 'location=yes');
        }
    }

    /**
     * @description
     * Service to take picture via camera phone and upload photo to server.
     */
    uploadImages(images: string[], type: string) {
        return new Promise((resolve, reject) => {
            if (!images.length) {
                resolve([]);
            }
            let fileSize;
            const nOfImages = images.length;
            let nOfComplete = 0;
            let nOfFailed = 0;
            const uploadedImages = [];
            const fileTransfer: FileTransferObject = this.fileTransfer.create();

            const uploadFile = (index, size) => {
                let tagString = SETTINGS.programTag;
                if (type === 'profile') {
                    tagString = tagString + '_profile';
                }

                // Add the Cloudinary "upload preset" name to the headers
                const uploadOptions = {
                    params: { upload_preset: this.settings.environment.cloudnaryUploadPreset, tags: tagString }
                };

                fileTransfer.onProgress(progress => {
                    // The upload plugin gives you information about how much data has been transferred
                    // on some interval.  Use this with the original file size to show a progress indicator.
                    const percentage = Math.floor((progress.loaded / size) * 100);
                    this.loader.show({
                        message: `Uploading Picture ${index + 1}/${nOfImages}:${percentage}%`,
                        duration: 2000
                    });
                });
                // Your Cloudinary URL will go here
                fileTransfer.upload(this.settings.environment.cloudnaryUploadUrl, images[index], uploadOptions).then(
                    result => {
                        // Result has a "response" property that is escaped
                        // FYI: The result will also have URLs for any new images generated with
                        // eager transformations
                        const response = JSON.parse(decodeURIComponent(result.response));
                        uploadedImages.push(response.url);
                        nOfComplete++;
                        if (nOfComplete === nOfImages) {
                            // Let the user know the upload is completed
                            this.loader.show({ message: 'Upload Completed', duration: 1000 });
                            resolve(uploadedImages);
                        }
                    },
                    err => {
                        // Uh oh!
                        this.loader.show({ message: 'Upload Failed', duration: 3000 });
                        nOfFailed++;
                        reject(err);
                    }
                );
            };

            // Find out how big the original file is
            images.forEach((obj, i) => {
                if (/^http:\/\/res.cloudinary.com\/mobileimages\/image\/upload/.test(images[i])) {
                    uploadedImages.push(images[i]);
                    nOfComplete++;
                    if (nOfComplete === nOfImages) {
                        // Let the user know the upload is completed
                        this.loader.show({ message: 'Update Completed', duration: 1000 });
                        resolve(uploadedImages);
                    }
                } else {
                    (window as any).resolveLocalFileSystemURL(images[i], (fileEntry: any) => {
                        fileEntry.file(function(fileObj) {
                            fileSize = fileObj.size;
                            // Display a loading indicator reporting the start of the upload
                            this.loader.showLoading('Uploading Picture ' + (i + 1) + '/' + nOfImages + ': ' + 0 + '%');
                            // Trigger the upload
                            uploadFile(i, fileSize);
                        });
                    });
                }
            });
        });
    }

    /**
     * @description Take and upload picture to server.
     */
    selectImages(imageCount = 0, maxImages = 5) {
        const options = this.options;

        options.maximumImagesCount = maxImages - imageCount;

        const sel = (firstTime?: boolean) =>
            this.imagePicker.hasReadPermission().then(hasReadPermission => {
                if (hasReadPermission) {
                    return this.imagePicker.getPictures(options) as Promise<any[]>;
                } else if (firstTime) {
                    this.imagePicker.requestReadPermission().then(() => {
                        return sel();
                    });
                }
            });
        return sel(true);
    }
}
