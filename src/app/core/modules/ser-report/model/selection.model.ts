import { ISerSenseSelection, SelectionType } from 'ser.api';

export enum SelectionObjectType {
    BOOKMARK = 'bookmark',
    HIDDEN_BOOKMARK = 'hiddenbookmark',
    DEFAULT = 'field'
}

export class SelectionModel implements ISerSenseSelection {

    /**
     * sense excel reporting selection object type
     * by default it is field, other values bookmark and hiddenbookmark
     * are only useable for static types not dynmic
     *
     * @private
     * @type {SER_SELECTION_OBJECT_TYPE}
     * @memberof SelectionModel
     */
    private serSelectionObjectType: SelectionObjectType;

    /**
     * sense excel reporting selection type
     *
     * @private
     * @type {SelectionType}
     * @memberof SelectionModel
     */
    private serSelectionType: SelectionType;

    /**
     * name for selection
     *
     * @private
     * @type {string}
     * @memberof SelectionModel
     */
    private serSelectionName: string;

    /**
     * selection value for the string
     *
     * @private
     * @type {string[]}
     * @memberof SelectionModel
     */
    private serSelectionValues: string[];

    /**
     * sense excel reporting selection object type, bookmark or hiddenbookmark
     *
     * @readonly
     * @type {SelectionObjectType}
     * @memberof SelectionModel
     */
    public get objectType(): SelectionObjectType {
        return this.serSelectionObjectType;
    }

    /**
     * sense excel reporting selection type dynamic or static
     *
     * @readonly
     * @type {SelectionType}
     * @memberof SelectionModel
     */
    public get type(): SelectionType {
        return this.serSelectionType;
    }

    /**
     * sense excel reporting name
     *
     * @readonly
     * @type {string}
     * @memberof SelectionModel
     */
    public get name(): string {
        return this.serSelectionName;
    }

    /**
     * selection values
     *
     * @readonly
     * @type {string[]}
     * @memberof SelectionModel
     */
    public get values(): string[] {
        return this.serSelectionValues;
    }

    /**
     * set object type for selection
     *
     * @memberof SelectionModel
     */
    public set objectType(objectType: SelectionObjectType) {
        this.serSelectionObjectType = objectType;
    }

    /**
     * set type for selection
     *
     * @memberof SelectionModel
     */
    public set type(type: SelectionType) {
        this.serSelectionType = type;
    }

    /**
     * set name for selection
     *
     * @memberof SelectionModel
     */
    public set name(name: string) {
        this.serSelectionName = name;
    }

    /**
     * set selection values
     *
     * @memberof SelectionModel
     */
    public set values(values: string[]) {
        this.serSelectionValues = values;
    }

    /**
     * get raw value for model
     *
     * @readonly
     * @type {ISerSenseSelection}
     * @memberof SelectionModel
     */
    public get raw(): ISerSenseSelection {

        return {
            name       : this.name,
            objectType : this.objectType,
            type       : this.type,
            values : this.values
        };
    }
}
