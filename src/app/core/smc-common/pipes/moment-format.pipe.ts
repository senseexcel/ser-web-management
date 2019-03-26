import { PipeTransform, Pipe } from '@angular/core';
import moment = require('moment');

@Pipe({name: 'momentFormat'})
export class MomentFormatPipe implements PipeTransform {

    transform(date: string | moment.Moment, showTime = false, defaultValue = '-') {

        let _date: moment.Moment;

        if (!date) {
            return defaultValue;
        }

        if (date && !moment.isMoment(date)) {
            _date = moment(date);
        } else {
            _date = date as moment.Moment;
        }

        let formatString = 'YYYY-MM-DD';
        formatString = showTime ? `${formatString}, HH:mm:ss` : formatString;
        return !_date.isValid() ? defaultValue : _date.format(formatString);
    }
}
