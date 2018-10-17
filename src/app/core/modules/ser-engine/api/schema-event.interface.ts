export interface ISchemaEvent {

    daylightSavingTime?: number;

    enabled?: boolean;

    eventType?: number;

    expirationDate?: string;

    incrementDescription?: string;

    incrementOption?: string;

    name?: string;

    privileges?: string[];

    schemaFilterDescription?: string[];

    startDate: string;

    timeZone?: string;

    id?: string;

    modifiedDate?: string;
}
