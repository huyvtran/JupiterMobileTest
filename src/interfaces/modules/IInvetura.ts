export class Inventura {
	organizacijskajedinica?: string
	datumpopisa?: string
	smjestaj?: string
	//stavke: Array<InventuraStavka>
}

export class InventuraStavka {
	barcode?: string
	datumpopisa?: string
	invbroj?: string
	naziv?: string
	osimovinaid?: number
	osinventuradetid?: number
	osinventuraglaid?: number
	popisanakolicina?: number
	smjestajnakolicina?: number
	vrijemepromjene?: any
	memo?: string
	guid?: string
}

export class SyncData {
	totalCount: number
	checkedCount: number
}

export class PopisanaList {
	osimovinaid: number
	kolicina: number
}

export class ScanSettings {
	count: number
	usescanwithmobile: boolean
	useoneclickscan: boolean
}

export class StavkaModel {
	action: string
	mobosinventuraglaid: number
	osinventuradetid: number
	osimovinaid: number
	kolicina: number
	vrijemeunosa: string
	memo?: string
}
