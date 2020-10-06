

export class UtilityDMSV2MediaRef {
  naziv:string;
  id:string;
  icon:string
  icon_color:string;
  size: number;
  datum:string;
  ext:string;


  constructor(file: any){
    //console.log(file)
    this.ext = file.ext;
    this.naziv = file.naziv;
    this.icon = this.getFileIcon();
    console.log(this.icon);
    this.icon_color = '#000';
    this.size = file.size;
    this.id = file.id;
    this.datum = file.datumkreiranja;

  }

  getFileIcon(): string {
    switch (this.ext) {
      case "pdf":
          return "custom-pdf";
      case "doc": case "docx":
          return "custom-word";
      case "xls": case "xlsx":
        return "custom-excel";
      case "txt":
        return "custom-txt";
      case "ppt": case "pptx": case "pps": case "ppsx":
          return "custom-powerpoint";        
      case "jpg": case "gif": case "png": case "jpeg": case "bmp":
        return "custom-image";
      default:
        return "custom-unknown";
    }
  }
}
