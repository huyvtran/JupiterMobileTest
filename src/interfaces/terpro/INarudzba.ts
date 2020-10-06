
//view model narudzba
export class Narudzba {

	pronarudzbeglaid?: number
	broj: string
	brojdok: number
	brojstavki?: number
	datumdok?: Date
	status: number
	statusnarudzbe: string
	vrstadok?: string
	vrstadokoznaka?: string
	vrstadokumenta?: string
	operaterid: number
	vrstadokid?: number
	opis?: string
	odgoda: number
	parstruid?: number
	partner?: string
	lokacija?: string
	nacinplacanjaid?: number
	iznos?: number
	adresa?: string
	mjesto?: string
	nacinplacanja?: string
	storno: number
	datum_zaprimanja?: Date
	uuid?: string
	prijenosind?: number
	broj_ispisa?: number
	fiskalnibroj?: string
	iznos_neto?: number
	iznos_rabat?: number
	iznos_osnovica?: number
	iznos_porez?: number
	iznos_ukupno?: number
	kod?:string
	jir?: string
	narudzbeid?: number
	//broj dokumenta za prikaz kad je storno 
	brojstorno?: string
	//indikator da je dokument donešen
	donos?: number
	fuuid?: string
	generacija?: string
	nextvrdid?: number
	terminalid?:number
	sktprometglaid?: number
	partneriid?: number
	stavke: Array<NarudzbaStavka>
}

//model za slanje računa
export class NarudzbaSync {
	action?:string
	pronarudzbeglaid?: number
	broj: string
	brojdok: number
	brojstavki?: number
	datumdok?: Date
	operaterid: string
	vrstadokid?: number
	status: number
	opis?: string
	odgoda: number
	parstruid?: number
	nacinplacanjaid?: number
	storno: number
	datum_zaprimanja?: Date
	uuid?: string
	prijenosind?: number
	broj_ispisa?: number
	fiskalnibroj?: string
	iznos_neto?: number
	iznos_rabat?: number
	iznos_osnovica?: number
	iznos_porez?: number
	iznos_ukupno?: number
	narudzbeid? : number
	kod?:string
	jir?: string
	fuuid?: string
	generacija?: string
	//terminalid: number
	brojstavaka?:number
	ukupniiznosspdv?: number

	stavke: Array<NarudzbaStavka>
}

export class NarudzbaStavka {
	action?:string
	pronarudzbedetid?: number
	cijena: number
	jm?: string
	kolicina: number
	//potrebna da bi mogao ispravno sumirati ambalazu
	kolicina_old?:number
	odgoda: number
	opis?: string
	naziv?: string
	pronarudzbeglaid?: number
	prometglaid?: number
	robaid: number
	rabat: number
	sifra?: string
	iznos?: number
	faktor?: number
	stopa?: number
	dod_jm?: string

	rabat1?:number
	rabat2?:number
	rabat3?:number
	rabat4?:number
	rabat5?:number

	nak_zbrinjavanje?: number
	nak_trosarina?: number
	nak_poticaj?: number
	iznos_neto?: number
	iznos_rabat?: number
	iznos_osnovica?: number
	iznos_porez?: number
	pov_nak_ind?: number
	pov_nak_sysind?: number
	pov_nak_iznos?: number

	//ubaceno za potrebe izvjestaja stanja skladista
	status?: number
	vrstadokid?: number
	broj?: string
	vrstadok?: string
	zakljuceni?: number
	//
	mpcijena?: number
	iznosstavkespdv?:number
}


//model za slanje dokumenata
export class DokumentSync {
	action:string
	vrstadokid: number
	parstruid: number
	nacinplacanjaid: number
	broj: string
	brojdok: number
	opis: string
	datumdok: Date
	datum_zaprimanja: Date
	uuid: string
	prijenosind: number
	broj_ispisa: number
	storno: number
	operateriid: string
	novidokid: number
	odgoda: number
	iznos_neto: number
	iznos_rabat: number
	iznos_osnovica: number
	iznos_porez: number
	generacija: string
	fiskalnibroj: string
	vrijemekreiranja: Date
	deviceuuid: string
	//terminalid: number

	//id dokumenta kojeg saljem , kako bi mi ga servis mogao vratiti da ga updateam kao poslanog
	id:number

	stavke: Array<DokumentStavka>
}

export class DokumentStavka {
	action:string
	robaid: number
	kolicina: number
	cijena: number
	rabat: number
	iznos_netoDet: number
	iznos_rabatDet: number
	iznos_osnovicaDet: number
	iznos_porezDet: number
	pov_nak_ind: number
	pov_nak_sysind: number
	opisDet: string
	odgodaDet: number

	rabat1?:number
	rabat2?:number
	rabat3?:number
	rabat4?:number
	rabat5?:number

	//key za povezivanje zglavlja i stavki na servisu
	terProID: string
}


export class NarudzbaFinData{
	iznos_neto?: number
	iznos_rabat?: number
	iznos_osnovica?: number
	iznos_porez?: number
	iznos_ukupno?: number
	odgoda?: number
}

