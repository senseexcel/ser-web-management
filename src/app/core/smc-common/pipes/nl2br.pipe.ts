import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'nl2br'
})
export class Nl2Br implements PipeTransform {
    transform(value: any): string {
        return value.replace(/\n/g, '<br />');
    }
}
