import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { File } from '@ionic-native/file/ngx';
import { CameraService } from '@services/camera/camera.service';
import { ImageService } from '@services/image/image.service';
import { Participant } from '@state/participant/participant.model';
import { ParticipantService } from '@state/participant/participant.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, of } from 'rxjs';
import { map, first, flatMap, distinctUntilChanged, skipWhile } from 'rxjs/operators';
import { ParticipantPhotoService } from '@state/participant-photo/participant-photo.service';
import { FormGroup, FormControl } from '@angular/forms';
import { LoaderService } from '@services/loader/loader.service';

@Component({
    selector: 'sei-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss']
})
export class EditProfilePage implements OnDestroy, OnInit {
    attendeeId: number;
    participant$: Observable<Participant>;
    photo: string;
    participantPhoto$: Observable<string>;

    form = new FormGroup({
        changePassword: new FormControl('')
    });
    get photo$() {
        if (this.isNewPhoto) {
            return of(this.photo);
        } else {
            return this.participantPhoto$;
        }
    }
    get isNewPhoto() {
        return typeof this.photo === 'string';
    }
    constructor(
        private cameraService: CameraService,
        private file: File,
        private loaderService: LoaderService,
        private imageService: ImageService,
        private participantService: ParticipantService,
        private participantPhotoService: ParticipantPhotoService,
        private routerQuery: RouterQuery
    ) {
        this.routerQuery
            .selectParams<string>('attendeeId')
            .pipe(distinctUntilChanged())
            .pipe(skipWhile(id => !id))
            .pipe(
                map(attendeeId => {
                    const id = parseInt(`${attendeeId}`, 10);
                    this.attendeeId = id;
                    this.participant$ = this.participantService.select(id);
                    this.participantPhotoService.load(id);
                    this.participantPhoto$ = this.participantPhotoService.select(id).pipe(
                        map(p => {
                            if (!p) {
                                return null;
                            } else {
                                return [
                                    p.participantPhoto,
                                    p.participantPhotoOptimized,
                                    p.participantPhotoThumbnail
                                ].find(i => !!i);
                            }
                        })
                    );
                })
            )
            .pipe(untilDestroyed(this))
            .subscribe();
    }
    ngOnDestroy() {}

    ngOnInit() {}

    save() {
        const changePassword = this.form.controls?.changePassword?.value;

        if (!this.isNewPhoto && !changePassword) {
            return;
        }
        this.photo$
            .pipe(
                flatMap(async photo => {
                    const params = {
                        changePassword,
                        photo: '',
                        showBadgeChat: 0 // TODO: future: chat
                    };
                    if (this.isNewPhoto) {
                        const res: any = !this.photo
                            ? null
                            : await this.imageService.uploadImages([this.photo], 'profile');
                        if (res?.length > 0) {
                            params.photo = res[0];
                        }
                    } else {
                        params.photo = photo;
                    }

                    return this.participantService
                        .save(this.attendeeId, {
                            changePassword: this.form.controls?.changePassword?.value,
                            photo,
                            showBadgeChat: 0
                        })
                        .toPromise();
                })
            )
            .pipe(first())
            .subscribe(() => {
                this.photo = null;
                return this.loaderService.show({ message: 'Profile Updated', duration: 1000 });
            });
    }

    revertPhoto() {
        this.photo = null;
    }

    removePhoto() {
        this.photo = '';
    }

    selectImages() {
        this.imageService.selectImages(0, 1).then(results => {
            const result = results && results[0];
            const filename = result.substring(result.lastIndexOf('/') + 1);
            const path = result.substring(0, result.lastIndexOf('/') + 1);
            this.file.readAsDataURL(path, filename).then(res => (this.photo = res));
        });
    }

    takePhoto() {
        this.cameraService.takePicture().then(imageURI => {
            const filename = imageURI.substring(imageURI.lastIndexOf('/') + 1);
            const path = imageURI.substring(0, imageURI.lastIndexOf('/') + 1);
            this.file.readAsDataURL(path, filename).then(res => (this.photo = res));
        });
    }
}
