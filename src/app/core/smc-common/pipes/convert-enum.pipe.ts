import { PipeTransform, Pipe } from '@angular/core';
import * as hjson from 'hjson';

@Pipe({
    name: 'convertEnumToJson'
})
export class ConvertEnumPipe implements PipeTransform {

    transform(data: any): any {
        return '';
    }
}
