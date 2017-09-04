export interface  Modules {
    db: string,
    operaterId: number,
    application: Module[]
}

export interface  Module {
    applicationId: number,
    name: string,
    icon: string
}