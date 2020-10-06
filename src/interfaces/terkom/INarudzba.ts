
//view model narudzba
export class Narudzba {

	id?: number
	operaterid: number
	datumdok?: Date
	datumkreiranja?: Date
	opis?: string
	vrstadokid?: number
	nacinplacanjaid?: number
	nacinisporukeid?: number
	prijenosind?: number
	parstruid?: number
	partner?: string
	iznos?: number
	longitude?: number
	latitude?: number
	vrstadok?: string
	adresa?: string
	mjesto?: string
	maxiznos?: number
	brojstavki?: number
	nacinisporuke?: string
	nacinplacanja?: string
	skladiste?: string
	skladisteid?: number
	partneriid?: number
	uuid?: string
	oznaka?: string
	//izmijena da mogu multi select razloga
	razlogpovrataid?: Array<string>
	razlogpovrata?: string
	stavke: Array<NarudzbaStavka>

	//indikator ukoliko je true salje narudzbe na servis, ukoliko nije ne dozvoljava slanje ( koristi se u provjeri stanja robe prije slanja za sprecavanje nastavka slanja)
	posalji?: boolean
}

//model za slanje narudzba
export class NarudzbaSync {
	action?: string
	id?: number
	datumdok: Date
	napomena: string
	vrstadokid: number
	nacinplacanjaid: number
	nacinisporukeid: number
	skladisteid: number
	parstruid: number
	//terminalid: number
	//string radi multi selecta
	mobterkom_razlogpovrata?: string
	uuid?: string
	operaterid?: string
	stavke: Array<NarudzbaStavka>
}

export class NarudzbaStavka {
	id?: number
	action?: string
	naziv?: string
	sifra?: string
	narudzbaid?: number
	robaid: number
	kolicina: number
	cijena: number
	iznos?: number
	faktor?: number
	porezposto?: number
	dodjm?: string
	jm?: string
	rabatPosto?: number
	opis?: string

	//indikator za povratnu naknadu
	pov_nak_ind?: number
	//indikator artikla povratne - ne dozvoli edit samo brisanje 
	pov_nak_sysind?: number
	//kod provjere stanja prilikom slanja postavi na false ako nema dovoljno na skladistu
	imanastanju?: boolean

	razlogpovratadetid?: Array<string>
	razlogpovratadet?: string
	razlogpovratadetstavka?: string
}

