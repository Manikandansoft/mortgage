import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { TransactionSummary } from 'src/app/model/model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  transaction: FormGroup;
  submitted = false;
  spinner = false;
  transactionSummaryList: TransactionSummary[];
  gridColumns = [];
  pagination = true;
  sorting = true;
  pageLinks = 5;
  accountDetails = JSON.parse(sessionStorage.getItem('accountDetail'));
  month = [];
  year = [];
  typeList = [];
  constructor(
    private fb: FormBuilder,
    public api: Service,
    private url: UrlConfig
  ) { }

  /* Form creation */
  private createForm() {
    this.transaction = this.fb.group({
      fromMonth: ['', Validators.required],
      fromYear: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  /*  Access to form fields */
  get transactionSummary() {
    return this.transaction.controls;
  }

  /* Modal Action */
  public modalAction(action: string): void {
    if (action === 'Ok') {
      this.api.alertConfigDefaultValue();
    }
  }

  /*  Search transaction summary*/
  getSummary() {
    this.submitted = true;
    if (this.transaction.valid) {
      this.generateGridColumn();
      const postObject = {
        month: this.transaction.value.fromMonth.name,
        userId: this.api.loggedUser().userId,
        type: this.transaction.value.type.value,
        year: Number(this.transaction.value.fromYear.name)
      };

      this.spinner = true;
      /* Api call*/
      this.api.postCall(this.url.urlConfig().transactionsSummary, JSON.stringify(postObject), 'post')
        .subscribe(summary => {
          this.spinner = false;
          if (summary.transactions) {
            this.transactionSummaryList = summary.transactions;
          } else {
            this.api.alertConfig = this.api.modalConfig('Error', summary.message, true, ['Ok']);
            this.transactionSummaryList = [];
          }
        },
          error => {
            this.spinner = false;
          });
    }
  }

  /* configure the grid columns */
  private generateGridColumn(): void {
    if (this.transaction.value.type.value === 'SAVINGS') {
      this.gridColumns = [
        {
          colName: 'Account Holder Name',
          rowName: 'benefactorName',
        }, {
          colName: 'From Account',
          rowName: 'fromAccount',
        }, {
          colName: 'To Account',
          rowName: 'toAccount',
        }, {
          colName: 'Amount',
          rowName: 'amount',
        }, {
          colName: 'Transaction Type',
          rowName: 'transactionType',
        }, {
          colName: 'Transaction Date',
          rowName: 'transactionDate',
        }
      ];
    } else {
      this.gridColumns = [
        {
          colName: 'Account Holder Name',
          rowName: 'benefactorName',
        }, {
          colName: 'From Account',
          rowName: 'toAccount',
        }, {
          colName: 'To Account',
          rowName: 'fromAccount',
        }, {
          colName: 'Amount',
          rowName: 'amount',
        }, {
          colName: 'Transaction Type',
          rowName: 'transactionType',
        }, {
          colName: 'Transaction Date',
          rowName: 'transactionDate',
        }
      ];
    }
  }

  ngOnInit() {
    /* Call the form creation while on component initiation */
    this.createForm();
    /* populating month */
    this.month = [
      { name: 'January', value: 1 },
      { name: 'Febuary', value: 2 },
      { name: 'March', value: 3 },
      { name: 'April', value: 4 },
      { name: 'May', value: 5 },
      { name: 'June', value: 6 },
      { name: 'July', value: 7 },
      { name: 'August', value: 8 },
      { name: 'September', value: 9 },
      { name: 'October', value: 10 },
      { name: 'November', value: 11 },
      { name: 'December', value: 12 }
    ];

    /* populating year */
    this.year = [
      { name: '2019', value: 2019 },
      { name: '2018', value: 2018 },
      { name: '2017', value: 2017 },
      { name: '2016', value: 2016 },
      { name: '2015', value: 2015 }
    ];
    this.typeList = [
      { name: 'Savings', value: 'SAVINGS' },
      { name: 'Mortgage', value: 'MORTGAGE' }
    ];
  }

}
