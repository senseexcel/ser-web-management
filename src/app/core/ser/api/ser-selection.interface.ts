export enum SelectionType {
    Dynamic = 'dynamic',
    Static  = 'static'
}

/** The selection of the report. */
export interface ISerSenseSelection {
    /** The Name of the filter. */
    name?: string;
    /**
    * Type of the filter type.
    *             By Default it will used 'Field'.
    *             Other Values are 'bookmark' and 'hiddenbookmark'
    */
    objectType?: string;
    /** The values that should be used. */
    values?: string[];
    /** Type of the selection. */
    type?: SelectionType;
    /** Export a Root node for the sheet names. */
    exportRootNode?: boolean;
    /**
    * Give the sheet a seperate sheet name form a formaula
    *             You can also use @@sheetname@@ as placeholter for the orignal sheet name.
    */
    sheetName?: string;
}
