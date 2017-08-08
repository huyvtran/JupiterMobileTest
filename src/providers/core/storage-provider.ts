import {Storage} from '@ionic/storage';

export class StorageProvider {
    static storage : Storage;

    static addToStorage(key : string, value : string) {
        this.initStorage();
        this
            .storage
            .ready()
            .then(() => {
                this
                    .storage
                    .set(key, value);
            });
    }

    static getFromStorage(key : string) {
        this.initStorage();
        return this.storage
            .ready()
            .then(() => {
                this.storage.get(key)
                .then(val => {
                    console.log(val);
                    return val;
                });
            })
            .then((val) => {
                return val;
            })
    }

    static initStorage() {
        if (this.storage == null) {
            this.storage = new Storage([]);
        }
    }

}