import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrefToJsPipe } from './href-to-js.pipe';
import { ChooseImagePipe } from './choose-image/choose-image.pipe';
import { FormatWavePipe } from './format-wave/format-wave.pipe';
import { FormatPhoneNumberPipe } from './format-phone-number/format-phone-number.pipe';
import { LocationNamePipe } from './location-name/location-name.pipe';

@NgModule({
    declarations: [HrefToJsPipe, ChooseImagePipe, FormatWavePipe, FormatPhoneNumberPipe, LocationNamePipe],
    exports: [HrefToJsPipe, ChooseImagePipe, FormatWavePipe, FormatPhoneNumberPipe, LocationNamePipe],
    imports: [CommonModule]
})
export class PipesModule {}
