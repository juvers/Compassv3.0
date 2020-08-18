import { IEnvironment } from '@interfaces/environment.interface';

export const ENVIRONMENTS: { [environment: string]: IEnvironment } = {
    development: {
        api: 'https://p113.compass.sei-mi.com',
        forgotPasswordApi:
            'https://medusa.sei-mi.com/forever/compass/forgot_password/compass_atlas_forgot_password.php',
        cloudnaryUploadPreset: 'vkahimdi',
        cloudnaryUploadUrl: 'https://api.cloudinary.com/v1_1/mobileimages/upload'
    },
    mock: {
        api: 'http://localhost:4333/',
        forgotPasswordApi:
            'https://medusa.sei-mi.com/forever/compass/forgot_password/compass_atlas_forgot_password.php',
        cloudnaryUploadPreset: 'vkahimdi',
        cloudnaryUploadUrl: 'https://api.cloudinary.com/v1_1/mobileimages/upload'
    },
    production: {
        api: 'https://p113.compass.sei-mi.com/',
        forgotPasswordApi:
            'https://medusa.sei-mi.com/forever/compass/forgot_password/compass_atlas_forgot_password.php',
        cloudnaryUploadPreset: 'vkahimdi',
        cloudnaryUploadUrl: 'https://api.cloudinary.com/v1_1/mobileimages/upload'
    }
};
