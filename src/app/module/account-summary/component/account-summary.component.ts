import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';

import { AccountSummary, Account } from 'src/app/model/model';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css']
})
export class AccountSummaryComponent implements OnInit {

  accountSummaryList: AccountSummary[];
  mortgageList: AccountSummary[];
  spinner = false;
  gridColumns = [];
  gridMortgageColumns = [];
  pagination = false;
  sorting = true;
  pageLinks = 5;
  accountDetails: Account;
  savingAccount = false;
  mortgageAccount = false;
  constructor(
    private api: Service,
    private url: UrlConfig
  ) { }

  /* get list */
  private getAccountSummaryList(): void {
    this.generateGridColumn();
    this.spinner = true;
    const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
    const id = `/${loggedId}`;
    this.api.getList(this.url.urlConfig().accountSummary.concat(id)).subscribe(summary => {
      this.spinner = false;
      if (summary) {
        this.accountSummaryList = summary[0].transactions;
        this.accountDetails = summary[0].account;
        this.accountSummaryList = summary[0].transactions;
        this.mortgageList = summary[1];
        sessionStorage.setItem('accountDetail', JSON.stringify(summary[0].account));
      }
    }, error => {
      this.spinner = false;
    });
  }
  /* Show saving account*/
  public showSaving() {
    this.savingAccount = !this.savingAccount;
  }
  /* Show saving account*/
  public showMortgage() {
    this.mortgageAccount = !this.mortgageAccount;
  }
  /* Modal Action */
  public modalAction(action: string): void {
    if (action === 'Ok') {
      this.api.alertConfigDefaultValue();
    }
  }

  /* configure the grid columns */
  private generateGridColumn(): void {
    this.gridColumns = [
      {
        colName: 'Beneficiary Name',
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
        colName: 'Transaction Date',
        rowName: 'transactionDate',
      }, {
        colName: 'Transaction Type',
        rowName: 'transactionType',
      }
    ];
    this.gridMortgageColumns = [
      {
        colName: 'Beneficiary Name',
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
        colName: 'Transaction Date',
        rowName: 'transactionDate',
      }, {
        colName: 'Transaction Type',
        rowName: 'transactionType',
      }
    ];
  }
  ngOnInit() {
    /* get Account summary while loading the component */
    this.getAccountSummaryList();
  }

}
