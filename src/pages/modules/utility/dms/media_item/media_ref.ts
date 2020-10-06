

export class MediaRef{
  naziv:string;
  id:string;
  icon:string
  icon_color:string;
  size: number;
  datum:string;


  constructor(file: any){
    //console.log(file)

    this.naziv = file.naziv;
    this.icon = 'ios-document-outline';
    this.icon_color = '#000';
    this.size = file.size;
    this.id = file.id;
    this.datum = file.datumkreiranja;
  }
}
