import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FundTransferRoutingModule } from './fund-transfer-routing.module';
import { FundTransferComponent } from './component/fund-transfer.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';



@NgModule({
  declarations: [FundTransferComponent],
  imports: [
    CommonModule,
    FundTransferRoutingModule,
    SharedModuleModule
  ]
})
export class FundTransferModule { }
