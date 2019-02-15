import { ItemList } from '@smc/modules/smc-ui/api/item-list.interface';

export namespace ISelection {

    export const DIMENSION_LIST: EngineAPI.IGenericDimensionsListProperties = {
        qInfo: {
            qType: 'DimensionList'
        },
        qDimensionListDef: {
            qType: 'dimension',
            qData: {
                title: '/title',
                tags: '/tags',
                grouping: '/qDim/qGrouping',
                info: '/qDimInfos'
            }
        }
    };

    export const FIELD_LIST = {
        qInfo: {
            qType: 'FieldList'
        },
        qFieldListDef: {
            qShowSystem: false,
            qShowHidden: false,
            qShowDerivedFields: false,
            qShowSemantic: false,
            qShowSrcTables: false,
            qShowImplicit: false
        }
    };

    export const VALUE_LIST: EngineAPI.IGenericListProperties = {
        qInfo: {
            qType: 'ListObject'
        },
        qListObjectDef: {
            qStateName: '$',
            qLibraryId: '',
            qDef: {
                qFieldDefs: [],
                qGrouping: 'N',
                qActiveField: 0,
                qFieldLabels: [],
            },
            qAutoSortByState: {
                qDisplayNumberOfRows: -1
            },
            qInitialDataFetch: [{
                qTop: 0,
                qLeft: 0,
                qHeight: 0,
                qWidth: 1
            }]
        }
    };

    export enum TYPE {
        DIMENSION = 'dimension',
        FIELD = 'field',
        VALUE = 'value',
        NONE  = 'undefined'
    }

    export interface Item extends ItemList.Item {
        id?: string;
        type: TYPE;
    }

    export interface ValueConnectorConfig {
        app?: EngineAPI.IApp;
        selectFrom?: SelectionConfig;
    }

    export interface SelectionConfig {
        type: ISelection.TYPE;
        value: string;
    }
}
