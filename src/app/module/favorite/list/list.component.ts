import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { Favorite, Bank } from 'src/app/model/model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  favoriteList: Favorite[];
  spinner = false;
  gridColumns = [];
  createFavoriteFlag = false;
  addFavorite = false;
  selectedRow: Favorite;
  favaritePayee: FormGroup;
  bankDetail: Bank;
  invalidBank = false;
  showBankDetail = false;
  submitted = false;
  constructor(
    public api: Service,
    private url: UrlConfig,
    private fb: FormBuilder,
  ) { }

  /*  Create form fields */
  private createForm() {
    this.favaritePayee = this.fb.group({
      accountNumber: ['', Validators.required],
      favoriteName: ['', Validators.required],
      ifscCode: ['', Validators.required],
    });
  }

  /*  Access to form fields */
  get mortgage() { return this.favaritePayee.controls; }

  /* get list */
  private getFavoriteList(): void {
    this.generateGridColumn();
    this.spinner = true;
    const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
    const params = `/${loggedId}/payees`;
    this.api.getList(this.url.urlConfig().getPayee.concat(params))
      .subscribe(favorite => {
        this.spinner = false;
        if (favorite) {
          this.favoriteList = favorite.favoritePayees;
        }
      }, error => {
        this.spinner = false;
      });
  }
  /* Modal Action */
  public modalAction(action: string): void {
    if (action === 'Ok' || action === 'No') {
      this.api.alertConfigDefaultValue();
    } else if (action === 'Close') {
      this.createFavoriteFlag = false;
      this.addFavorite = false;
      this.getFavoriteList();
    } else if (action === 'Yes') {
      this.deleteFavorite();
    }
  }
  /* Reset Action */
  public reset() {
    this.invalidBank = false;
    this.showBankDetail = false;
    this.submitted = false;
    this.createFavoriteFlag = false;
    this.addFavorite = false;
  }
  /* Valodate Account Number */
  public checkValidAccount() {
    this.invalidBank = false;
    this.showBankDetail = false;
    if (this.favaritePayee.value.accountNumber && this.favaritePayee.value.ifscCode) {
      const params = `?ifscCode=${this.favaritePayee.value.ifscCode}`;
      this.api.getList(this.url.urlConfig().getBank.concat(params))
        .subscribe(bank => {
          this.spinner = false;
          if (bank.statusCode === 200) {
            this.bankDetail = bank;
            this.invalidBank = false;
            this.showBankDetail = true;
          } else {
            this.invalidBank = true;
            this.showBankDetail = false;
          }
        }, error => {
          this.spinner = false;
        });
    }
  }

  /* configure the grid columns */
  private generateGridColumn(): void {
    this.gridColumns = [
      {
        colName: 'Beneficiary Name',
        rowName: 'favoriteName',
      }, {
        colName: 'Account Number',
        rowName: 'accountNumber',
      }, {
        colName: 'Name of the bank',
        rowName: 'bankName',
      }, {
        colName: 'Action',
        action: [
          { buttonName: 'Edit', class: 'edit', icon: 'pencil', favoriteFalg: true },
          { buttonName: 'Delete', class: 'delete', icon: 'trash', favoriteFalg: true }
        ]
      }
    ];
  }
  /* Get Action from Grid */
  public getAction(event) {
    this.createFavoriteFlag = false;
    this.selectedRow = event.gridValue;
    if (event.gridAction.buttonName === 'Edit') {
      this.createFavoriteFlag = true;
      this.populatePayeeList();
      this.addFavorite = false;
    } else if (event.gridAction.buttonName === 'Delete') {
      this.api.alertConfig = this.api.modalConfig('Confirm', 'Are you sure want to remove this benefactor', true, ['Yes', 'No']);
    }
  }

  /* Get populate payee list */
  private populatePayeeList() {
    this.favaritePayee.patchValue({
      accountNumber: this.selectedRow.accountNumber,
      favoriteName: this.selectedRow.favoriteName,
      ifscCode: this.selectedRow.ifscCode
    });
    this.checkValidAccount();

  }
  /* Show Add payee Modal */
  public addPayee() {
    this.createFavoriteFlag = true;
    this.addFavorite = true;
  }

  /* Get Add/edit Payee*/
  public addEditdPayee() {
    this.submitted = true;
    if (this.favaritePayee.valid && !this.invalidBank && this.favoriteList) {
      this.spinner = true;
      const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
      const params = `/${loggedId}/payees`;
      const postObj = {
        accountNumber: Number(this.favaritePayee.value.accountNumber),
        favoriteName: this.favaritePayee.value.favoriteName,
        ifscCode: this.favaritePayee.value.ifscCode,
        payeeId: null
      };
      if (!this.addFavorite) {
        postObj.payeeId = this.selectedRow.payeeId;
      }
      const type = this.addFavorite ? 'post' : 'put';
      /* Api call*/
      this.api.postCall(this.url.urlConfig().addPayee.concat(params), JSON.stringify(postObj), type )
        .subscribe(payee => {
          this.spinner = false;
          if (payee.statusCode === 200) {
            let message = '';
            if (!this.addFavorite) {
              message = `${payee.favoriteName} details has been updated successfully`;
            } else {
              message = `${payee.favoriteName} details has been added successfully`;
            }
            this.api.alertConfig = this.api.modalConfig('Success', message, true, ['Close']);
          } else {
            this.api.alertConfig = this.api.modalConfig('Success', payee.message, true, ['Ok']);
          }
        },
          error => {
            this.spinner = false;
          });
    }
  }

  /* Delete the Favorite */
  public deleteFavorite() {
    const loggedId = this.api.loggedUser() ? this.api.loggedUser().userId : null;
    const params = `/${loggedId}/payees?payeeId=${this.selectedRow.payeeId}`;
    this.api.deleteData(this.url.urlConfig().deletePayee.concat(params))
      .subscribe(favorite => {
        this.spinner = false;
        if (favorite.statusCode === 200) {
          const message = `${this.selectedRow.favoriteName} details has been removed successfully`;
          this.api.alertConfig = this.api.modalConfig('Success', message, true, ['Close']);
        } else {
          this.api.alertConfig = this.api.modalConfig('Success', favorite.message, true, ['Ok']);
        }
      }, error => {
        this.spinner = false;
      });
  }
  ngOnInit() {
    this.getFavoriteList();
    this.createForm();
  }

}
