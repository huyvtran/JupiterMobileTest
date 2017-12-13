import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrmFinancijePregledPage } from './pregled';

import { PipesModule } from '../../../../../pipes/pipes.module';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CrmFinancijePregledPage,
  ],
  imports: [
    IonicPageModule.forChild(CrmFinancijePregledPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    CrmFinancijePregledPage
  ]
})

export class CrmFinancijePregledPageModule { }
