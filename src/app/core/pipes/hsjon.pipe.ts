import { PipeTransform, Pipe } from '@angular/core';
import * as hjson from 'hjson';

@Pipe({
    name: 'hjson'
})
export class HJSonPipe implements PipeTransform {

    transform(value: any): string {

        return hjson.stringify(value, {
            /** keep whitespaces */
            keepWsc: true,
            /** set amount of spaces */
            space: 4,
            /** show colors */
            colors: false
        });
    }
}
