//*****data begin
export type QueryType = "text"

export interface IData {
    queries?: IQuery[];
    files?: IFile;
    logs?: ILog;
}

export interface IQuery {
    query: string;
    commandtype?: QueryType;
    params?: any;
    tablename?: string;
    refkey?: string;
    reftable?: string;
    singlerow?: boolean;
}

export interface IFile {
    filepath: string;
    endpoint: string;
}

export interface ILog {
    log: string;
    refreshtoken: string;
}
//*****data end


//***properties begin
export class IProperties {
    showLoader?: boolean 
    errorMessageResponse?: boolean
    errorMessageType?: string
    errorMessageCloseButton?: boolean
}


export class IPropertiesCore extends IProperties{
    tokenRequired?: boolean
    jupiterSystem?: boolean
    customApiEndPoint?: string
    spinApiEndPoint?: string
}

//***properties end