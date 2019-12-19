import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
@Component({
  selector: 'app-fund-transfer',
  templateUrl: './fund-transfer.component.html',
  styleUrls: ['./fund-transfer.component.css']
})
export class FundTransferComponent implements OnInit {
  fundTransferForm: FormGroup;
  submitted = false;
  spinner = false;
  accountDetails = JSON.parse(sessionStorage.getItem('accountDetail'));
  favariteDetail = [];
  constructor(
    private fb: FormBuilder,
    public api: Service,
    private url: UrlConfig,
  ) { }

  /* Form creation */
  private createForm() {
    this.fundTransferForm = this.fb.group({
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      remarks: ['']
    });
  }

  /*  Access to form fields */
  get transfer() {
    return this.fundTransferForm.controls;
  }

  /* Transfer Fund */
  public transferFund() {
    this.submitted = true;
    if (this.fundTransferForm.valid) {
      /* Validate whether it's same account */
      if (Number(this.fundTransferForm.value.toAccount) === this.accountDetails.accountNumber) {
        this.api.alertConfig = this.api.modalConfig('Error', 'Transfer is not allowed to same account', true, ['Ok']);
      } else {
        const fatvoriteDetail = this.favariteDetail.filter(fatvorite =>
          fatvorite.payeeId === Number(this.fundTransferForm.value.toAccount));
        const postObject = {
          fromAccount: this.accountDetails.accountNumber,
          toAccount: fatvoriteDetail[0].accountNumber,
          amount: Number(this.fundTransferForm.value.amount),
          remarks: this.fundTransferForm.value.remarks,
          benefactorName: fatvoriteDetail[0].favoriteName
        };
        this.spinner = true;
        /* Api call*/
        this.api.postCall(this.url.urlConfig().fundTransfer, JSON.stringify(postObject), 'post')
          .subscribe(transfer => {
            this.spinner = false;
            if (transfer) {
              this.accountDetails.balance = this.accountDetails.balance - transfer.amount;
              sessionStorage.setItem('accountDetail', JSON.stringify(this.accountDetails));
              this.api.alertConfig = this.api.modalConfig('Success', transfer.message, true, ['Ok']);
            }
          },
            error => {
              this.spinner = false;
            });
      }
    }
  }
  /* populate the benefactor name */
  public populateFavorite() {
    const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
    const params = `/${loggedId}/payees`;
    this.api.getList(this.url.urlConfig().getBenefactor.concat(params))
      .subscribe(favorite => {
        this.spinner = false;
        if (favorite.statusCode === 200) {
          this.favariteDetail = favorite.favoritePayees;
        } else {
          // tslint:disable-next-line: max-line-length
          this.api.alertConfig = this.api.modalConfig('Error', 'No favorite payeelist are found. Please add favorite payee to the payeelist', true, ['Ok']);
        }
      }, error => {
        this.spinner = false;
      });
  }

  /* Modal Action */
  public modalAction(action: string): void {
    if (action === 'Ok') {
      this.api.alertConfigDefaultValue();
    }
  }
  ngOnInit() {
    /* Call the form creation while on component initiation */
    this.createForm();
    this.populateFavorite();
  }

}
