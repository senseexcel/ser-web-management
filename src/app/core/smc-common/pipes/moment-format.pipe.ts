import { PipeTransform, Pipe } from '@angular/core';
import moment = require('moment');
import { format } from 'url';

@Pipe({name: 'momentFormat'})
export class MomentFormatPipe implements PipeTransform {

    transform(date: string, showTime = false) {
        if (!date) {
            return '';
        }

        let formatString = 'YYYY-MM-DD';
        formatString = showTime ? `${formatString}, HH:mm:ss` : formatString;
        return moment(date).format(formatString);
    }
}
