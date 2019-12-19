import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MortgageRoutingModule } from './mortgage-routing.module';
import {  MortgageComponent } from './component/component.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';


@NgModule({
  declarations: [MortgageComponent],
  imports: [
    CommonModule,
    MortgageRoutingModule,
    SharedModuleModule
  ]
})
export class MortgageModule { }
