
export class UtilityDMSV2FolderRef {

  id: string;
  path:string;
  name:string;
  icon:string;
  icon_color:string;
  type:string;
  brojFoldera:number;
  brojFileova:number;
  allowAdd: boolean;


  constructor(dir : any, path: string){
    //console.log(dir)

    this.name = dir.naziv;
    if (path == "x:\\") {
      this.path = path + dir.naziv;
    } else {
      this.path = path + '\\' + dir.naziv;  
    }
    //this.path = path + ' / ' + dir.naziv;
    this.type = dir.tip;
    this.icon = 'ios-folder-outline';
    this.icon_color = '#000';
    this.brojFileova = dir.doccount;
    this.brojFoldera = dir.dircount;
    this.id = dir.id;
    this.allowAdd = dir.allowadd;
  }

}