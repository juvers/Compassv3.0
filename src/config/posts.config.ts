export const POST_OPTIONS = {
    confettiOptions: {
        spread: 155,
        ticks: 250,
        particleCount: 50,
        startVelocity: 25,
        origin: { y: -0.3, x: 0.5 }
    },
    usePopupImagePreview: false,
    postTemplates: [
        { id: 0, label: 'None' },
        { id: 1, label: 'Agenda Update' },
        { id: 2, label: 'Alert' },
        { id: 3, label: 'Birthday' },
        { id: 4, label: 'Winner' }
    ],
    postImagesSlide: {
        zoom: false,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 4
    }
};
