import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FundTransferComponent } from './fund-transfer.component';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { of } from 'rxjs';

describe('FundTransferComponent', () => {
  let component: FundTransferComponent;
  let fixture: ComponentFixture<FundTransferComponent>;
  let api: Service;

  /* create mock data for testing */
  const MockUserService = {
    isValidUser: false,
    setValidUser: (flag: boolean) => { MockUserService.isValidUser = flag; },
    currentUser: {
      userName: 'Mani',
      userId: 1234,
      role: 'ADMIN'
    },
    validUser: () => MockUserService.isValidUser,
    loggedUser: () => {
      return MockUserService.currentUser;
    },
    modalConfig: () => ({
      header: '',
      message: '',
      modalShow: '',
      button: ''
    }),
    alertConfigDefaultValue: () => ({
      header: '',
      message: '',
      modalShow: '',
      button: ''
    }),
    postCall: () => {
      return of({});
    },
    getList: () => {
      return of({
        favoritePayees: [
          {
            payeeId: 12345,
            accountNumber: 1234567,
            favoriteName: 'Raj',
            bankName: 'ICIC'
          }
        ],
        bank: {
          bankName: 'ICICI',
          branchName: 'Bangalore',
          message: 'test',
          statusCode: 200
        }
      });
    }
  };

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FundTransferComponent],
      imports: [SharedModuleModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: Service, useValue: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        UrlConfig],
    })
      .compileComponents();
    api = TestBed.get(Service);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should check form creation while ngOnInit', () => {
  //   component.ngOnInit();
  //   component.fundTransferForm = formBuilder.group({
  //     toAccount: ['', Validators.required],
  //     amount: ['', Validators.required],
  //     remarks: ['']
  //   });
  //   expect(component.fundTransferForm.valid).toBeFalsy();
  // });

  // it('should validate populate favorite details', () => {
  //   component.populateFavorite();
  //   expect(component.spinner).toBeFalsy();
  // });

  // it('should validate transfer fund', () => {
  //   const account = {
  //     accountNumber: 23456,
  //     accountType: 'SAVINGS',
  //     balance: 10000
  //   };
  //   const favorite = [
  //     {
  //       payeeId: 12345,
  //       accountNumber: 1234567,
  //       favoriteName: 'Raj',
  //       bankName: 'ICIC'
  //     }
  //   ];
  //   // expect(component.transferFund.testingVar).toEqual("Working");
  //   component.fundTransferForm.controls.toAccount.setValue(123456);
  //   component.fundTransferForm.controls.amount.setValue('1000');
  //   component.fundTransferForm.controls.remarks.setValue('Initial transfer');
  //   component.accountDetails = account;
  //   component.favariteDetail[0] = favorite;
  //   // expect(component.accountDetails).toEqual(account);
  //   // expect(component.favariteDetail[0]).toEqual(favorite);
  //   // component.transferFund();
  //   component.submitted = true;
  //   expect(component.spinner).toBeFalsy();
  // });

  // it('Should validate modal action as Ok', () => {
  //   const action = 'Ok';
  //   component.modalAction(action);
  //   api.alertConfigDefaultValue();
  // });

});
