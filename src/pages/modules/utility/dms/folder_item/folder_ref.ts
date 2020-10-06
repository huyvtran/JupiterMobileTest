
export class FolderRef{

  dokid: string;
  path:string;
  name:string;
  icon:string;
  icon_color:string;
  type:string;
  brojFoldera:number;
  brojFileova:number;


  constructor(dir : any, path: string){
    //console.log(dir)

    this.name = dir.naziv;
    this.path = path + ' / ' + dir.naziv;
    this.type = 'folder'
    this.icon = 'ios-folder-outline';
    this.icon_color = '#000';
    this.brojFileova = dir.brojdokumenata;
    this.brojFoldera = dir.brojfoldera;
    this.dokid = dir.id;
  }

}