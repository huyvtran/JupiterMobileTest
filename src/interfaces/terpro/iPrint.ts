export class Narudzba {
 
	broj: string
	brojdok: number
	brojstavki?: number
	datumdok?: Date
	status: number
	statusnarudzbe: string
	vrstadok?: string
	vrstadokoznaka?: string
	operaterid: number
	vrstadokid?: number
	opis?: string
	odgoda: number
	parstruid?: number
	partner?: string
	partner_mjesto?: string
	partner_adresa?:string
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
    oib?: string
	telefon?: string
	
	//indikator da je dokument donešen
	donos?: number
	fuuid?: string
	generacija?: string
	nextvrdid?: number

	stavke: Array<NarudzbaStavka>
}

export class NarudzbaStavka {
	pronarudzbedetid?: number
    robaid?: number
	cijena: number
	jm?: string
	kolicina: number
	opis?: string
	naziv?: string
	rabat: number
	sifra?: string
	iznos?: number
    stopa?: number
	ukupno?: number = 0
	stopa_naziv?: string
	osnovica_porez?:number

	nak_zbrinjavanje?: number
	nak_trosarina?: number
	

    iznos_neto?: number
	iznos_rabat?: number
	iznos_osnovica?: number
	iznos_porez?: number
}


export class StatistikaStanje {

    sifra?: string
	naziv: string
	ulaz: number
	svi: number
	zakljuceni : number
	raspolozivo : number
}