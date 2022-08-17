import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CustomerListComponent } from "./customer-list.component";
import {
  CustomerDetailGuard,
  CustomerEditGuard
} from "./customer-guard.service";
import { CustomerFormComponent } from "./customer-form.component";

import { CustomerService } from "./customer.service";
import { SharedModule } from "../shared/shared.module";

import { MaterialModule } from "../shared/material.module";


@NgModule({
  imports: [
    SharedModule,
    MaterialModule,
    RouterModule.forChild([
      { path: "", component: CustomerListComponent },
      {
        path: "new/",
        canDeactivate: [CustomerEditGuard],
        component: CustomerFormComponent
      },
      {
        path: "edit/:id",
        canDeactivate: [CustomerEditGuard],
        component: CustomerFormComponent
      }
    ])
  ],
  declarations: [
    CustomerListComponent,
    CustomerFormComponent
  ],
  providers: [CustomerService, CustomerDetailGuard, CustomerEditGuard,
  ],
  exports: [
    CustomerListComponent,
    CustomerFormComponent,

  ]
})
export class CustomerModule { }
