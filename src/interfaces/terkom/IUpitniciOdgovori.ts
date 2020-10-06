

export interface IUpitniciOdgovor{
     parstruid: number;
     upitnici: Array<IUpitnik>;
}

export interface IUpitnik {
    
    tkupitnikid: number;
    poslan? : boolean
    pitanja : Array<IPitanja>;

}


export interface IPitanja{
    tkpitanjeid : number;
    tkpitanjevrstaid?: number;
    odgovor?: any;
    odgovorid?: number;
    upitnikID?: string;

}


export interface IUpitniciSync{
    action : string
    operaterid : string
    tkupitnikid : number
    parstruid : number
    stavke: Array<IPitanja>
}