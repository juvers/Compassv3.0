import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { POST_OPTIONS } from '@config/posts.config';
import { File } from '@ionic-native/file/ngx';
import { IonSlides } from '@ionic/angular';
import { CameraService } from '@services/camera/camera.service';
import { ImageService } from '@services/image/image.service';
import { LoaderService } from '@services/loader/loader.service';
import { ParticipantListComponent } from '@shared/components/participant-list/participant-list.component';
import { map, flatMap, first } from 'rxjs/operators';
import { ParticipantPartial } from 'src/app/state/participant/participant.model';
import { Post } from 'src/app/state/post/post.model';
import { PostService } from 'src/app/state/post/post.service';
import { PostComponentBase } from '../post-component-base.class';
import { combineLatest, of, forkJoin } from 'rxjs';

@Component({
    selector: 'sei-edit-post',
    templateUrl: './edit-post.component.html',
    styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent extends PostComponentBase implements OnInit {
    @ViewChild('slides', { static: false }) slides: IonSlides;
    @Input() isEdit: boolean;

    isAuthenticated$ = this.userService.isLoggedIn$;
    postParticipant$ = this.post?.participant
        ? of(this.post.participant)
        : this.participantService.currentUserParticipant$;
    posts$ = this.postService.items$;
    postTemplate: number;
    latestPost$ = this.posts$.pipe(map(posts => posts && posts[0]));
    showSettings$ = this.currentUser$.pipe(
        map(user => user?.roles.administrator && this.post?.participant?._id === user?._id)
    );
    postTemplates = POST_OPTIONS.postTemplates;

    postForm = new FormGroup({
        content: new FormControl(''),
        postFeatured: new FormControl(''),
        postTemplate: new FormControl('')
    });
    // comments$ = this.commentService.query.selectAll({ filterBy: comment => this.post._id === comment.postId });

    commentForm = new FormGroup({
        comment: new FormControl('', Validators.required)
    });

    get selectedTemplateText() {
        return this.postTemplates.find(t => t.id === this.postTemplate)?.label;
    }

    get isCreate() {
        return !!this.post && !this.post._id;
    }

    constructor(
        private cameraService: CameraService,
        private file: File,
        private imageService: ImageService,
        private loaderService: LoaderService,
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.latestPost$.pipe(first()).subscribe(l => (this.postTemplate = l?.postTemplate));
        if (!this.post) {
            this.post = new Post();
            this.participantService.currentUserParticipant$.pipe(first()).subscribe(participant => {
                this.post.participant = participant;
            });
        } else {
            this.postForm.controls.content.setValue(this.post.text);

            if (this.post.commentsCount > 0 && this.post._id) {
                this.commentService.loadPostComments(this.post._id).subscribe();
            }
        }
        this.postForm.patchValue({ postFeatured: !!(this.post.postFeatured || this.post.featuredPost) });
        super.ngOnInit();
    }

    close() {
        this.modalController.dismiss();
    }

    async openList(title: string, participants: ParticipantPartial[]) {
        this.bottomSheet.open(ParticipantListComponent, {
            data: { participants, title }
        });
    }

    sendComment() {
        this.participantService.currentUserParticipant$
            .pipe(
                flatMap(participant => {
                    return this.commentService.sendComment({
                        post: this.post._id,
                        participant,
                        postOwner: this.post.participant,
                        text: this.commentForm?.controls.comment?.value
                    });
                })
            )
            .pipe(first())
            .subscribe(() => {
                this.commentForm.reset();
            });
    }

    takePhoto() {
        if (this.post?.photos?.length >= 5) {
            alert('You can only post at most 5 photos at one time.');
        } else {
            this.cameraService.takePicture().then(imageURI => {
                this.isEdit = true;
                if (!this.post.photos) {
                    this.post.photos = [];
                }
                const filename = imageURI.substring(imageURI.lastIndexOf('/') + 1);
                const path = imageURI.substring(0, imageURI.lastIndexOf('/') + 1);
                this.file.readAsDataURL(path, filename).then(res => this.post.photos.push(res));
            });
        }
    }

    selectImages() {
        if (this.post?.photos?.length >= 5) {
            alert('You can only post at most 5 photos at one time.');
        } else {
            this.imageService.selectImages(this.post?.photos?.length).then(
                results => {
                    this.isEdit = true;
                    if (!this.post.photos) {
                        this.post.photos = [];
                    }
                    results?.forEach(result => {
                        const filename = result.substring(result.lastIndexOf('/') + 1);
                        const path = result.substring(0, result.lastIndexOf('/') + 1);
                        this.file.readAsDataURL(path, filename).then(res => this.post.photos.push(res));
                    });
                },
                err => {
                    console.log(err);
                }
            );
        }
    }

    submitPost() {
        this.post.text = this.postForm.controls.content.value;
        this.post.postTemplate = this.postForm.controls.postTemplate.value || 0;
        this.post.featuredPost = !!this.postForm.controls.postFeatured.value;
        this.post.tagsLocation = this.post.tagsLocation || 0;

        // TODO: CORDOVA: UPLOAD PHOTOS
        const payload: Partial<Post> = {
            _id: this.post._id,
            text: this.postForm.controls.content.value,
            tags: this.post.tags,
            tagsLocation: this.post.tagsLocation,
            photos: this.post.photos,
            featuredPost: !!this.postForm.controls.postFeatured.value,
            postTemplate: this.postForm.controls.postTemplate.value
        };

        this.postService
            .save(payload)
            .pipe(first())
            .subscribe(() => this.close());
    }

    removePhoto(index) {
        this.post.photos.splice(index, 1);
    }
}
