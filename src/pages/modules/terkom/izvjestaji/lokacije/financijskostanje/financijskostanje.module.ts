import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiLokacijeFinancijskoStanjePage } from './financijskostanje';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiLokacijeFinancijskoStanjePage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiLokacijeFinancijskoStanjePage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiLokacijeFinancijskoStanjePage
  ]
})
export class TerkomIzvjestajiLokacijeFinancijskoStanjePageModule {}

