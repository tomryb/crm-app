import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge, debounceTime } from 'rxjs';

import { Customer } from './customer';
import { CustomerService } from './customer.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'customer-form',
  templateUrl: './customer-form.component.html',
  styles: [`
    .title-spacer {
        flex: 1 1 auto;
      }
    .form-field{
        width: 100%;
        margin-left: 20px;
        margin-right: 20px;
    }
    `]
})
export class CustomerFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle: string = 'Update Customer';
  errorMessage: string;
  customerForm: FormGroup;
  customer: Customer = <Customer>{};
  private sub: Subscription;
  showImage: boolean;
  imageWidth: number = 100;
  imageMargin: number = 2;
  fieldColspan = 3;

  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private validationMessages: { [key: string]: { [key: string]: string } | {} } = {
    firstname: {
      required: 'Customer first name is required.',
      minlength: 'Customer first name must be at least one characters.',
      maxlength: 'Customer first name cannot exceed 100 characters.'
    },
    lastname: {
      required: 'Customer last name is required.',
      minlength: 'Customer last name must be at least one characters.',
      maxlength: 'Customer last name cannot exceed 100 characters.'
    },
    email: {
      required: 'Customer email is required.',
      minlength: 'Customer email must be at least one characters.',
      maxlength: 'Customer email cannot exceed 200 characters.'
    },
    rewards: {
      range: 'Rewards of the customer must be between 0 (lowest) and 150 (highest).'
    },
    phone: { maxlength: 'Customer phone cannot exceed 12 characters.' },
    mobile: { maxlength: 'Customer mobile cannot exceed 12 characters.' },
  };

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait
    ]).subscribe(result => {
      this.onScreensizeChange(result);
    });
    this.genericValidator = new GenericValidator(this.validationMessages);

  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      rewards: ['', NumberValidators.range(0, 150)],
      phone: ['', Validators.maxLength(12)],
      mobile: ['', Validators.maxLength(12)],
      membership: false,
    });
    this.sub = this.route.params.subscribe(
      params => {
        let id = +params['id'];
        this.getCustomer(id);
      }
    );
    this.sub.add(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.customerForm.valueChanges, ...controlBlurs).pipe(debounceTime(500)).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.customerForm);
    });
  }
  getCustomer(id: number): void {
    this.customerService.getCustomer(id)
      .subscribe(
        (customer: Customer) => this.onCustomerRetrieved(customer),
        (error: any) => this.errorMessage = <any>error
      );
  }
  onCustomerRetrieved(customer: Customer): void {
    if (this.customerForm) {
      this.customerForm.reset();
    }
    this.customer = customer;

    if (this.customer.id === 0) {
      this.pageTitle = 'New Customer';
    } else {
      this.pageTitle = `Customer: ${this.customer.firstname} ${this.customer.lastname}`;
    }
    this.customerForm.patchValue({
      firstname: this.customer.firstname,
      lastname: this.customer.lastname,
      email: this.customer.email,
      rewards: this.customer.rewards,
      phone: this.customer.phone,
      mobile: this.customer.mobile,
      membership: this.customer.membership
    });
  }
  deleteCustomer(): void {
    if (this.customer.id === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the customer: ${this.customer.firstname}?`)) {
        this.customerService.deleteCustomer(this.customer.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  toggleImage(): void {
    event.preventDefault();
    this.showImage = !this.showImage;
  }


  saveCustomer(): void {
    if (this.customerForm.dirty && this.customerForm.valid) {
      const customer = Object.assign({}, this.customer, this.customerForm.value);

      this.customerService.saveCustomer(customer)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.errorMessage = <any>error
        );
    } else if (!this.customerForm.dirty) {
      this.onSaveComplete();
    }
  }

  onSaveComplete(): void {
    this.customerForm.reset();
    this.router.navigate(['/customers']);
  }

  onScreensizeChange(result: any) {
    const isLess600 = this.breakpointObserver.isMatched('(max-width: 599px)');
    const isLess1000 = this.breakpointObserver.isMatched('(max-width: 959px)');
    if (isLess1000) {
      if (isLess600) {
        this.fieldColspan = 12;
      }
      else {
        this.fieldColspan = 6;
      }
    }
    else {
      this.fieldColspan = 3;
    }
  }
}
