import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiLokacijeRealizacijaPartneraPage } from './realizacijapartnera';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiLokacijeRealizacijaPartneraPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiLokacijeRealizacijaPartneraPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiLokacijeRealizacijaPartneraPage
  ]
})
export class TerkomIzvjestajiLokacijeRealizacijaPartneraPageModule {}