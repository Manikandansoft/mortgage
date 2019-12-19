import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';

import { Account, Option } from 'src/app/model/model';
@Component({
  selector: 'app-mortgage',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class MortgageComponent implements OnInit {
  spinner = false;
  accountList: Account[];
  gridColumns = [];
  createMortgageFlag = false;
  viewMortgageFlag = false;
  selectedRow;
  mortgageForm: FormGroup;
  mortgegeTypeList: Option[];
  submitted = false;
  interestRate = 8;
  interestFlag = false;
  emi = '';
  warningMessage = '';
  searchKey: string;
  pagination = true;
  sorting = true;
  pageLinks = 5;
  createMortgageSuccess;
  constructor(
    private api: Service,
    private url: UrlConfig,
    private fb: FormBuilder,
  ) { }

  /*  Create form fields */
  private createForm() {
    this.mortgageForm = this.fb.group({
      mortgegeType: ['', Validators.required],
      amount: ['', Validators.required],
      tenure: ['', Validators.required],
    });
  }

  /*  Access to form fields */
  get mortgage() { return this.mortgageForm.controls; }

  /* get Customer list */
  private getCustomerList(): void {
    this.generateGridColumn();
    this.spinner = true;
    const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
    const id = `/${loggedId}`;
    this.api.getList(this.url.urlConfig().mortagecustomerList.concat(id))
      .subscribe(customer => {
        this.spinner = false;
        if (customer) {
          this.accountList = customer;
        }
      }, error => {
        this.spinner = false;
      });
  }
  /* configure the grid columns */
  private generateGridColumn(): void {
    this.gridColumns = [
      {
        colName: 'Customer Name',
        rowName: 'firstName',
      },
      {
        colName: 'Account Number',
        rowName: 'accountNumber',
      }, {
        colName: 'Account',
        rowName: 'accountType',
      }, {
        colName: 'Balance',
        rowName: 'balance',
      }, {
        colName: 'Salary',
        rowName: 'salary',
      }, {
        colName: 'Action',
        action: [
          { buttonName: 'Create', class: 'create', icon: 'check', favoriteFalg: false },
          { buttonName: 'View', class: 'view', icon: 'search-plus', favoriteFalg: false  }],
      }
    ];
  }
  /* create Mortgage */
  public createMortgage() {
    this.submitted = true;
    if (this.mortgageForm.valid && !this.interestFlag) {
      /* Preparing the post data */
      const postObject = {
        customerId: this.selectedRow.userId,
        mortgageType: this.mortgageForm.value.mortgegeType,
        amount: Number(this.mortgageForm.value.amount),
        tenure: Number(this.mortgageForm.value.tenure),
        emi: Number(this.emi),
        interest: Number(this.interestRate),
      };
      this.spinner = true;
      const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
      const id = `/${loggedId}`;
      /* Api call*/
      this.api.postCall(this.url.urlConfig().createMortgage.concat(id), JSON.stringify(postObject), 'post')
      .subscribe(mortgage => {
        this.spinner = false;
        if (mortgage) {
          this.createMortgageSuccess = mortgage;
          this.createMortgageFlag = false;
          const message = `${mortgage.message}! Ac/No is: ${mortgage.accountNumber}`;
          this.getCustomerList();
        }
      },
      error => {
        this.spinner = false;
      });
    }
  }


  /* Reset Action */
  public reset() {
    this.createMortgageFlag = false;
    this.mortgageForm.reset();
    this.submitted = false;
    this.interestRate = 8;
  }
  /* Modal Action */
  public modalAction(action: string): void {
    if (action === 'Yes' || action === 'Close' ) {
      this.api.alertConfigDefaultValue();
      this.getCustomerList();
    } else if (action === 'ok') {
      this.api.alertConfigDefaultValue();
    } else {
      this.api.alertConfigDefaultValue();
    }
  }
  compoundInterest(principal: number, rateOfInterest: number, times: number, years: number) {
    return (principal * Math.pow((1 + (rateOfInterest / (times * 100))), (times * years)));
  }
  /* calculate EMI */
  calculateEMI() {
    this.warningMessage = '';
    if (this.mortgageForm.value.tenure && this.mortgageForm.value.amount) {
      const totalSalray = this.selectedRow.salary;
      const deductSalary = (totalSalray / 2);
      const extraDeduct = deductSalary / 10;
      const remainingSalary = totalSalray - (deductSalary + extraDeduct);
      const totalRemainingSalary = remainingSalary * 12 ;
      // tslint:disable-next-line: max-line-length
      const toatalAmountWithInterest = this.compoundInterest(this.mortgageForm.value.amount, this.interestRate, 1, this.mortgageForm.value.tenure);
      this.emi = (toatalAmountWithInterest / (12 * this.mortgageForm.value.tenure)).toFixed(2);
      if (totalRemainingSalary > toatalAmountWithInterest) {
        this.interestFlag = false;
      } else {
        this.interestFlag = true;
        this.warningMessage = `Sorry your'e salary was not sufficient to process the loan of this ${this.mortgageForm.value.amount}`;
      }
    }
  }
  /* View close */
  public closeView() {
    this.viewMortgageFlag = false;
  }
  /* Get Action from Grid */
  public getAction(event) {
    this.createMortgageFlag = false;
    this.selectedRow = event.gridValue;
    if (event.gridAction.buttonName === 'Create') {
      this.interestRate = 8;
      this.createMortgageFlag = true;
    } else if (event.gridAction.buttonName === 'View') {
      this.viewMortgageFlag = true;
    }
  }

  /* Search Customer */
  public searchCustomer() {
    if (this.searchKey) {
      this.spinner = true;
      const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
      const params = `/${loggedId}/search?accountNumber=${this.searchKey}`;
      this.api.getList(this.url.urlConfig().customerList.concat(params))
        .subscribe(customer => {
          this.spinner = false;
          if (customer) {
            this.accountList = customer;
          }
        }, error => {
          this.spinner = false;
        });
    } else {
      this.getCustomerList();
    }
  }

  ngOnInit() {
    this.getCustomerList();
    this.createForm();
    this.mortgegeTypeList = [
      {
        name: 'Housing Loan',
        value: 'housing'
      },
      {
        name: 'Car loan',
        value: 'car'
      }
    ];
  }

}
