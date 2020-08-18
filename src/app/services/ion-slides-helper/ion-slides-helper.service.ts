import { Injectable } from '@angular/core';

/**
 * This service is here as a helper for ion-slides configuration
 */
@Injectable({
    providedIn: 'root'
})
export class IonSlidesHelperService {
    constructor() {}

    /**
     * Get the complete list of swiper options from an swiper option arrays.
     * This is required for changing the default swiper animation effect on ion-slide.
     * @param options Swiper options (only effect currently working is fade) - visit http://idangero.us/swiper/api/ for more information.
     * @returns options - The same options with updated values.
     */
    getOptions(options: any = {}) {
        options.initialSlide = options.initialSlide ? options.initialSlide : 0;
        options.slidesPerView = options.slidesPerView ? options.slidesPerView : 1;
        options.autoplay = options.autoPlay ? options.autoPlay : true;

        if (options.effect === 'fade') {
            options.on = this.fadeEffectOn(options);
        }
        return options;
    }

    /**
     * Return the update "on" property for fade transition effect.
     * @param options Swiper options
     */
    private fadeEffectOn(options: any = {}) {
        return {
            beforeInit() {
                const swiper = this;
                swiper.classNames.push(`${swiper.params.containerModifierClass}fade`);
                const overwriteParams = {
                    slidesPerView: 1,
                    slidesPerColumn: 1,
                    slidesPerGroup: 1,
                    watchSlidesProgress: true,
                    spaceBetween: 0,
                    virtualTranslate: true,
                    speed: options.speed ? options.speed : 3000
                };
                swiper.params = Object.assign(swiper.params, overwriteParams);
                swiper.params = Object.assign(swiper.originalParams, overwriteParams);
            },
            setTranslate() {
                const swiper = this;
                const { slides } = swiper;
                for (let i = 0; i < slides.length; i += 1) {
                    const $slideEl = swiper.slides.eq(i);
                    const offset$$1 = $slideEl[0].swiperSlideOffset;
                    let tx = -offset$$1;
                    if (!swiper.params.virtualTranslate) {
                        tx -= swiper.translate;
                    }
                    let ty = 0;
                    if (!swiper.isHorizontal()) {
                        ty = tx;
                        tx = 0;
                    }
                    $slideEl
                        .css({
                            opacity: $slideEl[0].progress ? 0 : 1
                        })
                        .transform(`translate3d(${tx}px, ${ty}px, 0px)`);
                }
            },
            setTransition(duration) {
                const swiper = this;
                const { slides, $wrapperEl } = swiper;
                slides.transition(duration);
                if (swiper.params.virtualTranslate && duration !== 0) {
                    let eventTriggered = false;
                    slides.transitionEnd(() => {
                        if (eventTriggered) {
                            return;
                        }
                        if (!swiper || swiper.destroyed) {
                            return;
                        }
                        eventTriggered = true;
                        swiper.animating = false;
                        const triggerEvents = ['webkitTransitionEnd', 'transitionend'];
                        // tslint:disable-next-line: prefer-for-of
                        for (let i = 0; i < triggerEvents.length; i += 1) {
                            $wrapperEl.trigger(triggerEvents[i]);
                        }
                    });
                }
            }
        };
    }
}
