
import { Component, Input } from '@angular/core';
import { GlobalProvider } from '../../../providers/core/global-provider';
import { FavoritesProvider } from '../../../providers/core/favorites-provider';

/**
 * Generated class for the FavoriteComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */

@Component({
  selector: 'js-header',
  templateUrl: 'js-header.html'
})
export class JsHeaderComponent {

  @Input() title : string = "...";
  @Input() type : string;
  @Input() showFavorite : boolean;
  @Input() showClose : boolean;

  constructor(private globalProvider: GlobalProvider, private favoritesProvider: FavoritesProvider) {
    
  }

  goBack() {
    this.globalProvider.pullPage('');
  }

}
