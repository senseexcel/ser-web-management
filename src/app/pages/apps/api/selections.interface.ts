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

export enum SELECTION_TYPE {
    DIMENSION = 'dimension',
    FIELD     = 'field'
}

export interface IDimensionSelectionItem {
    id: string;
    title: string;
    type: SELECTION_TYPE.DIMENSION;
}

export interface IFieldSelectionItem {
    title: string;
    type: SELECTION_TYPE.FIELD;
}
