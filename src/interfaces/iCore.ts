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

export interface ILog{
    log: string;
    refreshtoken: string;
}
//*****data end