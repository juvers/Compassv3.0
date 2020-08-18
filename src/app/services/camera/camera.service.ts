import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
    providedIn: 'root'
})
export class CameraService {
    private options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 2000,
        targetHeight: 2000,
        saveToPhotoAlbum: true
    };

    constructor(private camera: Camera) {}

    clearCache() {
        this.camera.cleanup().then(
            () => {
                console.log('Camera cleanup success.');
            },
            error => {
                console.error('Camera cleanup failed because: ' + error);
            }
        );
    }

    public async takePicture() {
        return await this.camera.getPicture(this.options);
    }
}
