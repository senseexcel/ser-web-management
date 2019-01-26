import { ISerTemplate } from 'ser.api';
import { SelectionModel } from './selection.model';
import { IModel } from '@smc/modules/smc-common/api/model.interface';
import { importData, Validate, Validators, DataModel, mapDataTo } from '@smc/modules/smc-common/utils/model';

@DataModel
export class TemplateModel implements ISerTemplate {

    private templateGenerated: boolean;
    private templateInput: string;
    private templateOutput: string;
    private templateOutputFormat: string;
    private templateOutputPassword: string;
    private templateKeepFormula: boolean;
    private templateScriptKeys: string[];
    private templateScriptArgs: string[];
    private templateSelections: SelectionModel[] = [];

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

    public get selections(): SelectionModel[] {
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

    @Validate([Validators.isArray])
    @mapDataTo<SelectionModel[]>(SelectionModel)
    public set selections(selections: SelectionModel[]) {
        this.templateSelections = selections;
    }

    @importData
    public set raw(data: ISerTemplate) {
        console.log(data);
    }

    public get raw(): ISerTemplate {

        let selections = this.templateSelections as IModel[];

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
            selections: selections[0] ? [selections[0].raw] : [{}]
        };
    }
}
