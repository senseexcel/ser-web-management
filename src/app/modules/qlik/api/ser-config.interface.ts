export interface ISERConnection {
    app: string;
}

export interface ISERDistribution {

    mail: {
        active: boolean;

        subject: string;

        message: string;

        mailServer: {
            host: string;

            from: string;

            port: number;

            username: string;

            password: string;
        }
    };

    file: {
        active: boolean;

        target: string;

        mode: 'DeleteAllFirst';

        connections: any;
    };

    hub: {
        active: boolean;

        mode: 'DeleteAllFirst';

        connections: any;
    };
}

export interface ISERTemplate {

    input: string;

    output: string;

    selections: [
        {
            type: string;

            name: string;

            values: string;
        }
    ];
}

export interface ISERConfig {

    connections: ISERConnection;

    distribute: ISERDistribution;

    general: {};

    template: ISERTemplate;
}
