import { PipeTransform, Pipe } from '@angular/core';
import moment = require('moment');

@Pipe({name: 'momentFormat'})
export class MomentFormatPipe implements PipeTransform {

    transform(date: string) {
        if (!date) {
            return '';
        }
        return moment(date).format('YYYY-MM-DD');
    }
}
