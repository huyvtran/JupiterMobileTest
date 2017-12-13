export interface IAppUnlocked {
    code: string;
    db: string;
}

export interface IAppUnlockedDb {
    pin: string,
    appcode: string;
    deviceuuid: string;
    db: string;
}