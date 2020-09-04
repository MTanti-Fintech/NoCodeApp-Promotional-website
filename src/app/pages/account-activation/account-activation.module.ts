import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserActivationRoutingModule } from './account-activation-routing.module';
import { AccountActivationComponent } from './account-activation.component';
import { MaterialModule } from 'src/material-modules';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AccountActivationComponent,],
  imports: [
    CommonModule,
    UserActivationRoutingModule,
    MaterialModule,
        HttpClientModule,
        FormsModule
  ]
})
export class AccountActivationModule { }
