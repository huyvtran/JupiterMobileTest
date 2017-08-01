import { Injectable, Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the Search pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'search',
  pure: true
})
@Injectable()
export class SearchPipe implements PipeTransform {
  //private lst: any[];
  transform(list: any[], searchTerm: string, fieldName: string): any[] {
     //list = this.clearHighlight(list);
     if (searchTerm) {
        let fieldNameArr: string[] = fieldName.split('#');
        searchTerm = searchTerm.toUpperCase();
        var exists: boolean = false;
        let i = list.filter(item => {
          exists = false;
          fieldNameArr.forEach(element => {
            if (item[element].toUpperCase().indexOf(searchTerm) !== -1)
            {
              exists = true;
            }
          });
          if (exists)
            return true;
          else
            return false;
            
          //return item[fieldName].toUpperCase().indexOf(searchTerm) !== -1 
        });
        return i;
        // //return i;
        // for (let i of list) {
        //   var regEx = new RegExp(searchTerm, "ig");
        //   var replaceMask = "<span class='highlight'>" + searchTerm + "</span>" ;
        //   //i.naziv = i.naziv.toUpperCase().replace(searchTerm, "<span class='highlight'>" + searchTerm + "</span>"); // "4", "5", "6"
        //   i.naziv = i.naziv.replace(regEx, replaceMask);
        // }
        // //i[0].naziv="testiram";
        // return i;
      } else {
        return list;
      }
  }

  clearHighlight(list: any[]) {
      if (list != null) {
        for (let i of list) {
          i.naziv = i.naziv.replace("<span class='highlight'>", "").replace("</span>", "");
        }
      }
      return list;
      
  }

}
