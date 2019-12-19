import { Injectable } from '@angular/core';
@Injectable()
export class UrlConfig {
    serverConfig = false;
    private apiMock = 'http://localhost:3000/';

    private apiHost = {
        retailBank: 'http://10.117.189.59:8080/retailbanking/',
        payee: 'http://10.117.189.59:8083/'
    };
    url = {};

    /* url config with url list */
    urlApi() {
        return this.url = {
            userLogin: this.apiMock + 'users/user/login',
            userRegister: this.apiMock + 'users',
            customerList: this.apiMock + 'users',
            mortagecustomerList: this.apiMock + 'users',
            accountSummary: this.apiMock + 'transactions',
            fundTransfer: this.apiMock + 'transactions/fundTransfer',
            transactionsSummary: this.apiMock + 'transactions/monthTransaction',
            createMortgage:  this.apiMock + 'accounts/mortgage',
            getPayee:  this.apiMock + 'favoritePayees',
            getBank:  this.apiMock + 'favoritePayees',
            addPayee:  this.apiMock + 'favoritePayees',
            deletePayee:  'http://10.117.189.122:8083/banking-app/',
            getBenefactor:  'http://10.117.189.122:8083/banking-app/'
        };
    }

    /* url config with url list */
    urlMock() {
        return this.url = {
            userLogin: this.apiHost.retailBank + 'users/user/login',
            userRegister: this.apiHost.retailBank + 'users',
            customerList: this.apiHost.retailBank + 'users',
            mortagecustomerList: this.apiHost.retailBank + 'users',
            accountSummary: this.apiHost.retailBank + 'transactions',
            fundTransfer: this.apiHost.retailBank + 'transactions/fundTransfer',
            transactionsSummary: this.apiHost.retailBank + 'transactions/monthTransaction',
            createMortgage:  this.apiHost.retailBank + 'accounts/mortgage',
            getPayee:   this.apiHost.payee + 'banking-app' ,
            getBank:  this.apiHost.payee + 'banking-app/banks',
            addPayee:  this.apiHost.payee + 'banking-app',
            deletePayee:   this.apiHost.payee + 'banking-app',
            getBenefactor:  this.apiHost.retailBank + 'accounts'
        };
    }
    /* return url */
    urlConfig() {
        return  this.serverConfig ? this.urlApi() : this.urlMock();
    }
}
