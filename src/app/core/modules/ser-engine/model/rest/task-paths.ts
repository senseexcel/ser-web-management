export class RestTaskEndpoints {

    public get allTasks() {
        return {
            type: 'GET',
            url: '/qrs/selection/{id}/app/full'
        }
    }
}
