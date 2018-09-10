import { Observable } from 'rxjs';

export function queueOperator(callBack: () => any) {

    const queue = [];

    return (source) => {

        return Observable.create( (subscriber) => {

            source.subscribe( (data) => {
                queue.push(data);

                if ( queue.length < 5) {
                }
            });
        });
    };

    // return new subject wich submits values
}
