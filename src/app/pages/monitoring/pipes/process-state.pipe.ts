import { Pipe, PipeTransform } from '@angular/core';
import { ProcessStatus } from '../api';

@Pipe({
    name: 'processState'
})
export class ProcessStatePipe implements PipeTransform {

    transform(value: number): string {

        let state: string;

        switch (value) {
            case ProcessStatus.COMPLETED:  state = 'COMPLETED';  break;
            case ProcessStatus.DELIVER:    state = 'DELIVER';    break;
            case ProcessStatus.ERROR:      state = 'ERROR';      break;
            case ProcessStatus.PROCESSING: state = 'PROCESSING'; break;
            default:                       state = 'IDLE';
        }

        return `SMC_MONITORING.PROCESS.STATE.${state}`;
    }
}
