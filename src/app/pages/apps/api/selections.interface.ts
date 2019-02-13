import { RemoteSource } from '@smc/modules/smc-ui/api/remote-source.connector';
import { IDataNode } from '@smc/modules/smc-common/api';

export namespace ISelection {

    export const DIMENSION_LIST = {
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
        VALUE = 'value'
    }

    export interface Item extends RemoteSource.Item {
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
