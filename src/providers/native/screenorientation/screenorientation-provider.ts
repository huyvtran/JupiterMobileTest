import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import {GlobalProvider} from '../../core/global-provider';
import {StorageProvider} from '../../core/storage-provider';
import {ConstProvider} from '../../core/const-provider';

@Injectable()
export class NativeScreenOrientationProvider {
    
    public isTablet : boolean = false;

    constructor(public platform: Platform,
                    private storageProvider: StorageProvider, 
                    private screenOrientation: ScreenOrientation,
                    private globalProvider: GlobalProvider,
                    private constProvider: ConstProvider) { 

    }

    

    changeOrientation(){
        
        if (!this.platform.is('cordova') || this.platform.is('core'))
            return;
        
        if(this.isTablet ){
             this.isLandscapeOrientation('islandscape')
                .then((res) => {                
                    //ako je true za landscape provjeri koja strana (primary ili secondary)
                    if(res){
                        

                        this.getOrientation('landscapeorientation')
                            .then(res => {
                                console.log(res)
                                if(res === 'primary'){
                                    this.screenOrientation.unlock();
                                    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
                                } 
                                else if(res === 'secondary'){
                                    this.screenOrientation.unlock();
                                    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
                                }
                                    
                            })
                    }      
                    else{
                        this.screenOrientation.unlock();
                        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
                    }
                        

                })
                .catch((err) =>
                    {
                        console.log(err);
                        this.globalProvider.logError(err,false)
                    }
                )
        }
        
    }


    isLandscapeOrientation(variable: string) : Promise<any> {
         let val : boolean = false;
         
         return new Promise((resolve, reject) => {
             this.storageProvider.getFromStorage(this.constProvider.coreStorageKeys.settings, null, false)

                .then((res) => {
                    if(res &&  res[variable]){
                        val = res[variable]                        
                    }  
                    resolve(val);   
                })
                .catch((error) => {
                    this.globalProvider.logError(error, false)
                    reject()
                });
        });  
	}

   getOrientation(variable: string) : Promise<any> {
         let val : boolean = false;
         
         return new Promise((resolve, reject) => {
             this.storageProvider.getFromStorage(this.constProvider.coreStorageKeys.settings, null, false)

                .then((res) => {
                    if(res &&  res[variable]){
                        val = res[variable]                        
                    }  
                    resolve(val);   
                })
                .catch((error) => {
                    this.globalProvider.logError(error, false)
                    reject()
                });
        });  
	}
}
