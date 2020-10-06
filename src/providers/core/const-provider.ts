import { Injectable } from '@angular/core';

import { ConstSharedProvider } from '../shared/shared-provider';

import { ICoreStorageKeys } from '../../interfaces/core/storagekeys';
import { IStaticStartPages } from './../../interfaces/core/iStaticStartPages';


@Injectable()
export class ConstProvider extends ConstSharedProvider {

    public static get version() : string { return "9.3.12" };
    //public get spinApiGen() : string { return "http://213.202.75.115:40080/gen/api/" };
    public get spinApiCore() : string { return "http://213.202.75.115:40080/core/api/" };

    // serviceCustomUrl: string = "http://ts1.zito.hr/jupitermobileterkom/api/"; 

    public staticStartPages: IStaticStartPages = {
        infoPartner: "SearchPartnerPage",
        infoOsobe: "SearchOsobePage",
        infoRoba: "SearchRobaPage"
    }


    public isDevMode: boolean = false;

    dataRetryNumber: number = 0;


    public static coreStorageKeys : ICoreStorageKeys = {
        jupiterSystemData: "core.jupiterSystemData.001",
        company: "core.company.001",
        loginData: "core.loginData.001",
        modules: "core.modules.001",
        favorites: "core.favorites.001",
        appUnlocked: "core.appUnlocked.001",
        logPages: "core.logPages.001",
        settings: "core.settings.001"
    };

    public coreStorageKeys : ICoreStorageKeys = {
        jupiterSystemData: "core.jupiterSystemData.001",
        company: "core.company.001",
        loginData: "core.loginData.001",
        modules: "core.modules.001",
        favorites: "core.favorites.001",
        appUnlocked: "core.appUnlocked.001",
        logPages: "core.logPages.001",
        settings: "core.settings.001"
    };

	public inventuraStorageKeys : Array<{keyname: string, keyvalue: string}> = [
        { keyname : "inventura", keyvalue:  "utility.inventura.inv.001"},
        { keyname: "imovina", keyvalue: "utility.inventura.imo.001"}
    ]
	
    public terProStorageKeys : Array<{keyname: string, keyvalue: string}> = [
        { keyname : "partneri", keyvalue:  "terpro.partneri.001"},
        { keyname : "roba" , keyvalue: "terpro.roba.001"},
        { keyname : "rute", keyvalue: "terpro.rute.001"},
        { keyname : "klase", keyvalue: "terpro.klase.001"},
        { keyname : "ugovori", keyvalue: "terpro.ugovori.001"},
        { keyname : "vrstadokumenta", keyvalue: "terpro.vrstadokumenta.001"},
        { keyname : "nacinplacanja", keyvalue: "terpro.nacinplacanja.001"},
        { keyname : "narudzbe", keyvalue: "terpro.narudzbe.001"},
        { keyname : "stanjeskladista", keyvalue: "terpro.stanjeskladista.001"},
        { keyname : "jmroba", keyvalue: "terpro.jmroba.001"},
        { keyname : "user", keyvalue: "terpro.user.001"},
        { keyname : "firma", keyvalue: "terpro.firma.001"},
        { keyname : "footer", keyvalue: "terpro.footer.001"},
        { keyname : "vezarobapartner", keyvalue: "terpro.vezarobapartner.001"}
    ]

    public storageKeys : Array<{keyname: string, keyvalue: string}> = [
        { keyname : "partneri", keyvalue:  "terkom.partneri.001"},
        { keyname : "roba" , keyvalue: "terkom.roba.001"},
        { keyname : "rute", keyvalue: "terkom.rute.001"},
        { keyname : "klase", keyvalue: "terkom.klase.001"},
        { keyname : "nacinisporuke", keyvalue: "terkom.nacinisporuke.001"},
        { keyname : "nacinplacanja", keyvalue: "terkom.nacinplacanja.001"},
        { keyname : "asortiman", keyvalue: "terkom.asortiman.001"},
        { keyname : "asortimanvrsta", keyvalue: "terkom.asortimanvrsta.001"},
        { keyname : "vrstadokumenta", keyvalue: "terkom.vrstadokumenta.001"},
        { keyname : "vrstaobilaska", keyvalue: "terkom.vrstaobilaska.001"},
        { keyname : "pubvars", keyvalue: "terkom.pubvars.001"},
        { keyname : "izvjestaji", keyvalue: "terkom.izvjestaji.001"},
        { keyname : "skladista", keyvalue: "terkom.skladista.001"},
        { keyname : "upitnici", keyvalue: "terkom.upitnici.001"},
        { keyname : "pitanja", keyvalue: "terkom.pitanja.001"},
        { keyname : "odgovori", keyvalue: "terkom.odgovori.001"},
        { keyname : "razlogpovrata", keyvalue: "terkom.razlogpovrata.001"},
        { keyname : "obavijesti", keyvalue: "terkom.obavijesti.001"},


        { keyname : "biljeskeff",                   keyvalue: "crm.biljeskeff.001"},
        { keyname : "cjenikff",                     keyvalue: "crm.cjenikff.001"},
        { keyname : "konsolidacija-partnera-ff",    keyvalue: "crm.konsolidacija-partnera-ff.001"},

        { keyname : "popoverpovijest_crm_4",        keyvalue: "crm.popoverpovijest_4.001"},  
        { keyname : "popoverpovijest_crm_6",        keyvalue: "crm.popoverpovijest_6.001"},
        { keyname : "popoverpovijest_crm_10",       keyvalue: "crm.popoverpovijest_10.001"},
        { keyname : "popoverpovijest_crm_11",       keyvalue: "crm.popoverpovijest_11.001"},
        { keyname : "popoverpovijest_crm_8",        keyvalue: "crm.popoverpovijest_8.001"},
        { keyname : "popoverpovijest_crm_7",        keyvalue: "crm.popoverpovijest_7.001"},
        { keyname : "popoverpovijest_crm_12",       keyvalue: "crm.popoverpovijest_12.001"},
        { keyname : "popoverpovijest_crm_13",       keyvalue: "crm.popoverpovijest_13.001"},
        { keyname : "popoverpovijest_crm_55",       keyvalue: "crm.popoverpovijest_55.001"},      
        { keyname : "popoverpovijest_crm_555",      keyvalue: "crm.popoverpovijest_555.001"},
        { keyname : "popoverpovijest_crm_14",       keyvalue: "crm.popoverpovijest_14.001"},
        { keyname : "popoverpovijest_crm_15",       keyvalue: "crm.popoverpovijest_15.001"},
        { keyname : "popoverpovijest_crm_16",       keyvalue: "crm.popoverpovijest_16.001"},
        { keyname : "popoverpovijest_mp_4",         keyvalue: "mp.popoverpovijest_4.001"},  
        { keyname : "popoverpovijest_mp_6",         keyvalue: "mp.popoverpovijest_6.001"},
        { keyname : "popoverpovijest_mp_10",        keyvalue: "mp.popoverpovijest_10.001"},
        { keyname : "popoverpovijest_mp_11",        keyvalue: "mp.popoverpovijest_11.001"},
        { keyname : "popoverpovijest_mp_8",         keyvalue: "mp.popoverpovijest_8.001"},
        { keyname : "popoverpovijest_mp_7",         keyvalue: "mp.popoverpovijest_7.001"},
        { keyname : "popoverpovijest_mp_12",        keyvalue: "mp.popoverpovijest_12.001"},
        { keyname : "popoverpovijest_mp_13",        keyvalue: "mp.popoverpovijest_13.001"},
        { keyname : "popoverpovijest_mp_55",        keyvalue: "mp.popoverpovijest_55.001"},      
        { keyname : "popoverpovijest_mp_555",       keyvalue: "mp.popoverpovijest_555.001"},
        { keyname : "popoverpovijest_mp_14",        keyvalue: "mp.popoverpovijest_14.001"},
        { keyname : "popoverpovijest_mp_15",        keyvalue: "mp.popoverpovijest_15.001"},
        { keyname : "popoverpovijest_mp_16",        keyvalue: "mp.popoverpovijest_16.001"},

        { keyname : "hijerarhijskapotvrđenhint_crm",keyvalue: "crm.hijerarhijskapotvrđenhint.001"},        
        { keyname : "hijerarhijskapotvrđenhint_mp", keyvalue: "mp.hijerarhijskapotvrđenhint.001"},

        { keyname : "trazilicalista_crm_4",         keyvalue: "crm.trazilicalista_4.001"},  
        { keyname : "trazilicalista_crm_6",         keyvalue: "crm.trazilicalista_6.001"},
        { keyname : "trazilicalista_crm_10",        keyvalue: "crm.trazilicalista_10.001"},
        { keyname : "trazilicalista_crm_11",        keyvalue: "crm.trazilicalista_11.001"},
        { keyname : "trazilicalista_crm_8",         keyvalue: "crm.trazilicalista_8.001"},
        { keyname : "trazilicalista_crm_7",         keyvalue: "crm.trazilicalista_7.001"},
        { keyname : "trazilicalista_crm_12",        keyvalue: "crm.trazilicalista_12.001"},
        { keyname : "trazilicalista_crm_13",        keyvalue: "crm.trazilicalista_13.001"},
        { keyname : "trazilicalista_crm_55",        keyvalue: "crm.trazilicalista_55.001"},      
        { keyname : "trazilicalista_crm_555",       keyvalue: "crm.trazilicalista_555.001"},
        { keyname : "trazilicalista_crm_14",        keyvalue: "crm.trazilicalista_14.001"},
        { keyname : "trazilicalista_crm_15",        keyvalue: "crm.trazilicalista_15.001"},
        { keyname : "trazilicalista_crm_16",        keyvalue: "crm.trazilicalista_16.001"},
        { keyname : "trazilicalista_mp_4",          keyvalue: "mp.trazilicalista_4.001"},
        { keyname : "trazilicalista_mp_6",          keyvalue: "mp.trazilicalista_6.001"},
        { keyname : "trazilicalista_mp_10",         keyvalue: "mp.trazilicalista_10.001"},
        { keyname : "trazilicalista_mp_11",         keyvalue: "mp.trazilicalista_11.001"},
        { keyname : "trazilicalista_mp_8",          keyvalue: "mp.trazilicalista_8.001"},
        { keyname : "trazilicalista_mp_7",          keyvalue: "mp.trazilicalista_7.001"},
        { keyname : "trazilicalista_mp_12",         keyvalue: "mp.trazilicalista_12.001"},
        { keyname : "trazilicalista_mp_13",         keyvalue: "mp.trazilicalista_13.001"},
        { keyname : "trazilicalista_mp_55",         keyvalue: "mp.trazilicalista_55.001"},      
        { keyname : "trazilicalista_mp_555",        keyvalue: "mp.trazilicalista_555.001"},
        { keyname : "trazilicalista_mp_14",         keyvalue: "mp.trazilicalista_14.001"},
        { keyname : "trazilicalista_mp_15",         keyvalue: "mp.trazilicalista_15.001"},
        { keyname : "trazilicalista_mp_16",         keyvalue: "mp.trazilicalista_16.001"},

        { keyname : "trazilicaval_crm_4",           keyvalue: "crm.trazilicaval_4.001"},  
        { keyname : "trazilicaval_crm_6",           keyvalue: "crm.trazilicaval_6.001"},
        { keyname : "trazilicaval_crm_10",          keyvalue: "crm.trazilicaval_10.001"},
        { keyname : "trazilicaval_crm_11",          keyvalue: "crm.trazilicaval_11.001"},
        { keyname : "trazilicaval_crm_8",           keyvalue: "crm.trazilicaval_8.001"},
        { keyname : "trazilicaval_crm_7",           keyvalue: "crm.trazilicaval_7.001"},
        { keyname : "trazilicaval_crm_12",          keyvalue: "crm.trazilicaval_12.001"},
        { keyname : "trazilicaval_crm_13",          keyvalue: "crm.trazilicaval_13.001"},
        { keyname : "trazilicaval_crm_55",          keyvalue: "crm.trazilicaval_55.001"},      
        { keyname : "trazilicaval_crm_555",         keyvalue: "crm.trazilicaval_555.001"},
        { keyname : "trazilicaval_crm_14",          keyvalue: "crm.trazilicaval_14.001"},
        { keyname : "trazilicaval_crm_15",          keyvalue: "crm.trazilicaval_15.001"},
        { keyname : "trazilicaval_crm_16",          keyvalue: "crm.trazilicaval_16.001"},
        { keyname : "trazilicaval_mp_4",            keyvalue: "mp.trazilicaval_4.001"},
        { keyname : "trazilicaval_mp_6",            keyvalue: "mp.trazilicaval_6.001"},
        { keyname : "trazilicaval_mp_10",           keyvalue: "mp.trazilicaval_10.001"},
        { keyname : "trazilicaval_mp_11",           keyvalue: "mp.trazilicaval_11.001"},
        { keyname : "trazilicaval_mp_8",            keyvalue: "mp.trazilicaval_8.001"},
        { keyname : "trazilicaval_mp_7",            keyvalue: "mp.trazilicaval_7.001"},
        { keyname : "trazilicaval_mp_12",           keyvalue: "mp.trazilicaval_12.001"},
        { keyname : "trazilicaval_mp_13",           keyvalue: "mp.trazilicaval_13.001"},
        { keyname : "trazilicaval_mp_55",           keyvalue: "mp.trazilicaval_55.001"},      
        { keyname : "trazilicaval_mp_555",          keyvalue: "mp.trazilicaval_555.001"},
        { keyname : "trazilicaval_mp_14",           keyvalue: "mp.trazilicaval_14.001"},
        { keyname : "trazilicaval_mp_15",           keyvalue: "mp.trazilicaval_15.001"},
        { keyname : "trazilicaval_mp_16",           keyvalue: "mp.trazilicaval_16.001"},

        { keyname : "stanjeskladistaff",            keyvalue: "crm.stanjeskladistaff.001"},
        { keyname : "ugovorisdobavljacimaff1",      keyvalue: "crm.ugovorisdobavljacimaff1.001"},
        { keyname : "ugovorisdobavljacimaff2",      keyvalue: "crm.ugovorisdobavljacimaff2.001"}, 
        { keyname : "ugovoriskupcimaff1",           keyvalue: "crm.ugovoriskupcimaff1.001"},
        { keyname : "ugovoriskupcimaff2",           keyvalue: "crm.ugovoriskupcimaff2.001"}, 
        { keyname : "analizaprenesenihutrzakaff",   keyvalue: "mp.analizaprenesenihutrzakaff.001"}, 
        { keyname : "stanjeff",                     keyvalue: "mp.stanjeff.001"}, 
        
        { keyname : "inventuralistatrgovinaon",     keyvalue: "mp.inventuralistatrgovinaon.001"}, 
        { keyname : "inventuraoffinventura",        keyvalue: "mp.inventuraoffinventura.001"}, 
        { keyname : "inventuraoffgotovo",           keyvalue: "mp.inventuraoffgotovo.001"}, 
        { keyname : "inventuraoffinvid",            keyvalue: "mp.inventuraoffinvid.001"}, 
        { keyname : "inventuraofftrgovina",         keyvalue: "mp.inventuraofftrgovina.001"}, 
        { keyname : "inventuraoffdatumdok",         keyvalue: "mp.inventuraoffdatumdok.001"}, 
        { keyname : "inventuraoffitem",             keyvalue: "mp.inventuraoffitem.001"}, 
        { keyname : "inventuraoninvid",             keyvalue: "mp.inventuraoninvid.001"}
    ];

    
    public narudzbaKey : { keyname: string, keyvalue: string} = { keyname : "narudzba" , keyvalue : "terkom.narudzba.001" }
    public terkomUserKey : { keyname: string, keyvalue: string} = { keyname : "user" , keyvalue : "terkom.user.001" }
    public terproUserKey : { keyname: string, keyvalue: string} = { keyname : "user" , keyvalue : "terpro.user.001" }
    //public userKey : { keyname: string, keyvalue: string} = { keyname : "user" , keyvalue : "terkom.user.001" }
    public favoriteKey : {keyname: string, keyvalue: string} = { keyname : "favorit" , keyvalue : "terkom.favorit.001" }
    public evidencijaposjetaKey : {keyname: string, keyvalue: string} = { keyname : "posjet" , keyvalue : "terkom.posjet.001" }
    public odgovoriUpitniciKey : {keyname: string, keyvalue: string} = { keyname : "odgovoriUpitnici" , keyvalue : "terkom.odgovoriUpitnici.001" }


}