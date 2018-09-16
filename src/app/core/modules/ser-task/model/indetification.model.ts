import { IModel } from '@core/api/model.interface';

export class IdentificationModel implements IModel {

    /**
     * name for the task
     *
     * @type {string}
     * @memberof IdentificationModel
     */
    public identificationName: string;

    /**
     * app id which has the task
     *
     * @type {string}
     * @memberof IdentificationModel
     */
    public identificationApp: string;

    /**
     * get tassk name
     *
     * @type {string}
     * @memberof IdentificationModel
     */
    public get name(): string {
        return this.identificationName;
    }

    /**
     * get app id
     *
     * @type {string}
     * @memberof IdentificationModel
     */
    public get app(): string {
        return this.identificationApp;
    }

    /**
     * set name for task
     *
     * @memberof IdentificationModel
     */
    public set name(name: string) {
        this.identificationName = name;
    }

    /**
     * set app id for task
     *
     * @memberof IdentificationModel
     */
    public set app(app: string) {
        this.identificationApp = app;
    }

    /**
     * get raw data for model
     *
     * @readonly
     * @memberof IdentificationModel
     */
    public get raw() {
        return {
            app: this.app,
            name: this.name
        };
    }
}
