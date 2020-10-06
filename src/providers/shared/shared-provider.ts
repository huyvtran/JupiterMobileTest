import { IModulesStorageKeys } from './../../interfaces/core/storagekeys';
export class ConstSharedProvider {

    public modulesStorageKeys : IModulesStorageKeys = {
        infoPartnersHistory: "info.partners.history.002",
        infoRobaHistory: "info.roba.history.001",
        infoOsobeHistory: "info.osobe.history.001"
    };

    server: string = ""
    db: string = ""
    uid: string = ""
    pwd: string = ""

    operaterId: number = 0
    login: string = "";
}