import { Component, Injector, OnInit } from '@angular/core';
import { fadeOutAnimation, zoomInAnimation } from 'angular-animations';
import { PostComponentBase } from '../post-component-base.class';
import { PostComponentReadonlyBase } from '../post-component-readonly.base.class';

@Component({
    selector: 'sei-promoted-post',
    templateUrl: './promoted-post.component.html',
    styleUrls: ['./promoted-post.component.scss'],
    animations: [zoomInAnimation({ duration: 2500 }), fadeOutAnimation({ anchor: 'fadeOutCircle', duration: 2500 })]
})
export class PromotedPostComponent extends PostComponentReadonlyBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        if (this.post?.postTemplate === 3 || this.post?.postTemplate === 4) {
            this.pulse();
        }
    }
    pulse() {
        this.pulseAnimation = false;

        setTimeout(() => {
            this.pulseAnimation = true;
        }, 600);
    }
}
