import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberRoutingModule } from './member-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SharedModuleModule } from '../../shared/shared-module.module';


@NgModule({
  declarations: [RegisterComponent, LoginComponent],
  imports: [
    CommonModule,
    MemberRoutingModule,
    SharedModuleModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MemberModule { }
