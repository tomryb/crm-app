import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, CanDeactivate } from '@angular/router';

import { CustomerFormComponent } from './customer-form.component';

@Injectable()
export class CustomerDetailGuard implements CanActivate {
  constructor(private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    let id = +route.url[1].path;
    if (isNaN(id) || id < 1) {
      alert('Invalid customer Id');
      this.router.navigate(['/customers']);
      return false;
    };
    return true;
  }
}
@Injectable()
export class CustomerEditGuard implements CanDeactivate<CustomerFormComponent> {

  canDeactivate(component: CustomerFormComponent): boolean {
    if (component.customerForm.dirty) {
      let customerName = component.customerForm.get('firstname').value || 'New Customer';
      return confirm(`Navigate away and lose all changes to ${customerName}?`);
    }
    return true;
  }
}
