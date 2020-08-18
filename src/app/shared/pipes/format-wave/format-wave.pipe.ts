import { Pipe, PipeTransform } from '@angular/core';
import { SETTINGS } from '@config/settings';

@Pipe({
    name: 'formatWave'
})
export class FormatWavePipe implements PipeTransform {
    transform(value: number): string {
        if (value === SETTINGS.waveToCountAsAllWaves) {
            return 'All';
        } else {
            return `${value}`;
        }
    }
}
