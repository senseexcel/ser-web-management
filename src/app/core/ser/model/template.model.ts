import { ISerTemplate, ISerSenseSelection } from 'ser.api';
import { SelectionModel } from './selection.model';
import { IModel } from '@smc/modules/smc-common/api/model.interface';
import { importData, mapDataTo } from '@smc/modules/smc-common/utils/model';

export class TemplateModel implements ISerTemplate {

    private templateGenerated: boolean;
    private templateInput: string;
    private templateOutput: string;
    private templateOutputFormat: string;
    private templateOutputPassword: string;
    private templateKeepFormula: boolean;
    private templateScriptKeys: string[];
    private templateScriptArgs: string[];
    private templateSelections: ISerSenseSelection[] = [];

    public get generated(): boolean {
        return this.templateGenerated;
    }

    public get input(): string {
        return this.templateInput;
    }

    public get output(): string {
        return this.templateOutput;
    }

    public get outputFormat(): string {
        return this.templateOutputFormat;
    }

    public get outputPassword(): string {
        return this.templateOutputPassword;
    }

    public get keepFormula(): boolean {
        return this.templateKeepFormula;
    }

    public get scriptKeys(): string[] {
        return this.templateScriptKeys;
    }

    public get scriptArgs(): string[] {
        return this.templateScriptArgs;
    }

    public get selections(): ISerSenseSelection[] {
        return this.templateSelections;
    }

    public set generated(isGenerated: boolean) {
        this.templateGenerated = isGenerated;
    }

    public set input(value: string) {
        this.templateInput = value;
    }

    public set output(value: string) {
        this.templateOutput = value;
    }

    public set outputFormat(format: string) {
        this.templateOutputFormat = format;
    }

    public set outputPassword(passwd) {
        this.templateOutputPassword = passwd;
    }

    public set keepFormula(keep: boolean) {
        this.templateKeepFormula = keep;
    }

    public set scriptKeys(keys: string[]) {
        this.templateScriptKeys = keys;
    }

    public set scriptArgs(args: string[]) {
        this.templateScriptArgs = args;
    }

    @mapDataTo<SelectionModel>(SelectionModel)
    public set selections(selections: ISerSenseSelection[]) {
        this.templateSelections = selections;
    }

    @importData
    public set raw(data: ISerTemplate) {
    }

    public get raw(): ISerTemplate {

        let selections = this.templateSelections as IModel<any>[];

        if (!selections) {
            selections = [new SelectionModel()];
        }

        return {
            input: this.templateInput,
            output: this.templateOutput,
            outputFormat: this.templateOutputFormat,
            outputPassword: this.templateOutputPassword,
            keepFormula: this.templateKeepFormula,
            scriptKeys: this.templateScriptKeys,
            scriptArgs: this.templateScriptArgs,
            selections: selections.map((selection) => selection.raw)
        };
    }
}
