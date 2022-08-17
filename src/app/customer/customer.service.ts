import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendService } from '../_services'
import { Observable, of, throwError  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Customer } from './customer';

@Injectable()
export class CustomerService {
  private basicAction = 'customers/';

  constructor(private http: HttpClient, private backend: BackendService) { }

  getCustomers(): Observable<Customer[]> {
    return this.backend.getAll(this.basicAction)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  getCustomer(id: number): Observable<Customer> {
    if (id === 0) {
      return of(this.initializeCustomer());
    };
    const action = `${this.basicAction}${id}`;
    return this.backend.getById(action)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(id: number): Observable<Response> {

    const action = `${this.basicAction}${id}`;
    return this.backend.delete(action)
      .pipe(catchError(this.handleError));
  }

  saveCustomer(customer: Customer): Observable<Customer> {


    if (customer.id === 0) {
      return this.createCustomer(customer);
    }
    return this.updateCustomer(customer);
  }

  private createCustomer(customer: Customer): Observable<Customer> {
    customer.id = undefined;
    return this.backend.create(this.basicAction, customer)
      .pipe(map(this.extractData))
      .pipe(catchError(this.handleError));
  }

  private updateCustomer(customer: Customer): Observable<Customer> {
    const action = `${this.basicAction}${customer.id}`;
    return this.backend.update(action, customer)
      .pipe(map(() => customer))
      .pipe(catchError(this.handleError));
  }

  private extractData(response: Response) {
    let body : any = response.json ? response.json() : response;
    return body.data ? body.data : (body || {});
  }

  private handleError(error: Response): Observable<any> {
    console.error(error);
    return throwError (error.json() || 'Server error');
  }

  initializeCustomer(): Customer {
    return {
      id: 0,
      firstname: null,
      lastname: null,
      rewards: 0,
      email: null,
      membership: false,
      mobile: null,
      phone:null
    };
  }
}
