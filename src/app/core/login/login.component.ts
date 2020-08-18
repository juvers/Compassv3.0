import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LOGIN_PAGE_CONFIG } from '@config/login-page.config';
import { VALIDATION } from '@constants/validation.constants';
import { Vibration } from '@ionic-native/vibration/ngx';
import { MenuController, ModalController } from '@ionic/angular';
import { AlertService } from '@services/alert/alert.service';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { LoaderService } from '@services/loader/loader.service';
import { first, flatMap } from 'rxjs/operators';
import { ParticipantService } from 'src/app/state/participant/participant.service';
import { ParticipantPhotoService } from '@state/participant-photo/participant-photo.service';
import { UserService } from '@state/user/user.service';

@Component({
    selector: 'sei-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy, OnInit {
    testObject = { key1: 'value1', key2: 'value2' };

    authenticationError: boolean;
    errorMessages = {
        emailforgot: {
            required: 'Email Address is <strong>required</strong>',
            pattern: 'Please enter a valid email address.'
        },
        username: {
            required: 'Username is <strong>required</strong>'
        },
        password: {
            required: 'Password is <strong>required</strong>'
        }
    };
    forgotSubmitted: boolean;
    loginForgotError: string;
    loginTextForgot: string;

    loginForgotForm = new FormGroup({
        emailforgot: new FormControl('', [Validators.required, Validators.pattern(VALIDATION.regex.email)])
    });
    loginForm = new FormGroup({
        password: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required)
    });

    get config() {
        return LOGIN_PAGE_CONFIG;
    }

    constructor(
        private alert: AlertService,
        private authentication: AuthenticationService,
        private loader: LoaderService,
        private menu: MenuController,
        private modal: ModalController,
        private participantService: ParticipantService,
        private participantPhotoService: ParticipantPhotoService,
        private userService: UserService,
        private vibration: Vibration
    ) {}

    ngOnDestroy() {}
    ngOnInit() {}

    close() {
        this.modal.dismiss();
    }
    forgotLogin() {
        this.forgotSubmitted = true;
        if (!this.loginForgotForm.valid || !this.loginForgotForm?.controls?.emailforgot?.value) {
            this.loader.show({
                message: 'Please input an email address...',
                duration: 2000
            });
            return;
        }
        this.loader.show({
            message: 'Processing...',
            duration: 2000,
            spinner: 'circular',
            cssClass: 'spinner-energized'
        });

        this.loginTextForgot = 'Processing...';

        this.authentication
            .forgotLogin(this.loginForgotForm?.controls?.emailforgot?.value)
            .pipe(first())
            .subscribe(
                emailSent => {
                    if (emailSent) {
                        this.loginTextForgot = 'An email has been sent to your email address.';
                        this.alert.show(
                            {
                                message: 'An email has been sent.'
                            },
                            5000
                        );
                    } else {
                        this.loginForgotError = 'An email could not be sent, please contact us directly.';
                        this.alert.show(
                            {
                                message: 'An email could not be sent. Please contact us directly.'
                            },
                            5000
                        );
                    }
                },
                () => {
                    this.loginForgotError = 'An email could not be sent, please contact us directly.';
                    this.loader.show({ message: 'An Email could not be Sent...', duration: 2000 });
                }
            );
    }

    login() {
        if (this.loginForm.valid) {
            const handleError = error => {
                this.authenticationError = true;
                this.loader.hide();
                this.alert.show(
                    {
                        message: 'Authentication Error'
                    },
                    3000
                );

                this.vibration.vibrate(100);
                console.log(error);
            };
            this.loader.show({
                message: 'Authenticating...',
                duration: 5000,
                spinner: 'circular',
                cssClass: 'spinner-energized'
            });

            this.userService
                .login({
                    username: this.loginForm?.controls?.username?.value,
                    password: this.loginForm?.controls?.password?.value
                })
                .pipe(first())
                .subscribe(
                    user => {
                        if (user) {
                            this.authenticationError = false;

                            // TODO: Future: Chat
                            // Socket.init();

                            this.participantService
                                .load()
                                .pipe(flatMap(() => this.participantPhotoService.load()))
                                .pipe(first())
                                .subscribe();

                            // TODO: Future: Leaderboard
                            // $rootScope.getLeaderboard();

                            this.loader.hide();
                            // wrap the menu open in a small timeout to no overlap with the modal animation.
                            this.modal
                                .dismiss({ authenticated: true })
                                .finally(() => setTimeout(() => this.menu.open('start'), 100));
                        } else {
                            handleError('empty token');
                        }
                    },
                    error => handleError(error)
                );
        }
    }
}
