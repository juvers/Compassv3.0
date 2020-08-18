import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chooseImage'
})
export class ChooseImagePipe implements PipeTransform {
    transform(value: string[]): string {
        return value?.find(item => !!item);
    }
}
