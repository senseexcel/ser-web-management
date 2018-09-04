import { Injectable } from '@angular/core';
import { SERConfig  } from '@qlik/model/ser-config.model';
import { ISerConfiguration, ISerReport } from '@qlik/api/ser-config.interface';
import { ISerGeneral, ISerConnection, ISerTemplate } from 'ser.api';
import { Subject } from 'rxjs';

export enum SerConfigProperies {
    CONNECTION = 0,
    DISTRIBUTION = 1,
    GENERAL = 2,
    TEMPLATE = 3,
}

@Injectable()
export class SerConfigProvider {

    public update$: Subject<ISerConfiguration>;

    private serConfig: SERConfig;

    constructor() {
        this.serConfig = new SERConfig();
        this.update$   = new Subject<ISerConfiguration>();
    }

    public loadConfiguration(config: ISerConfiguration) {

        config.tasks
            .reduce( (previous: ISerReport[], current): ISerReport[] => {
                if ( current.hasOwnProperty('reports') ) {
                    return current.reports;
                }
                return previous;
            }, [])
            .forEach( (report: ISerReport) => {
                this.serConfig.connectionConfig   = report.connections;
                this.serConfig.distributionConfig = report.distribute;
                this.serConfig.generalConfig      = report.general;
                this.serConfig.templateConfig     = report.template;
            });
    }

    public writeConfigValue(type: SerConfigProperies, data: ISerConnection | ISerGeneral | ISerTemplate) {

        switch (type) {
            case SerConfigProperies.CONNECTION:
                this.serConfig.connectionConfig = data as ISerConnection;
                break;

            case SerConfigProperies.DISTRIBUTION:
                this.serConfig.connectionConfig = data as any;
                break;

            case SerConfigProperies.GENERAL:
                this.serConfig.generalConfig = data as ISerGeneral;
                break;

            case SerConfigProperies.TEMPLATE:
                this.serConfig.templateConfig = data as ISerTemplate;
                break;

            default :
                throw new Error(`could not write configuration for ${type}`);
        }

        this.update$.next(this.getFullConfig());
    }

    public getConfig(type: number): ISerTemplate | ISerConnection | ISerGeneral {

        switch ( type ) {
            case SerConfigProperies.CONNECTION:
                return this.serConfig.connectionConfig;

            case SerConfigProperies.DISTRIBUTION:
                return this.serConfig.distributionConfig;

            case SerConfigProperies.GENERAL:
                return this.serConfig.generalConfig as ISerGeneral;

            case SerConfigProperies.TEMPLATE:
                return this.serConfig.templateConfig;

            default:
                throw new Error('Configuration could not found');
        }
    }

    public getFullConfig(): ISerConfiguration {

        const reportConfig = [{
            connections: this.serConfig.connectionConfig,
            template   : this.serConfig.templateConfig,
            distribute : this.serConfig.distributionConfig,
            general    : this.serConfig.generalConfig as ISerGeneral
        }];

        return {
            tasks: [
                {
                    reports: reportConfig
                }
            ]
        };
    }
}
