import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionComponent } from './transaction.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { of } from 'rxjs';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let api: Service;

  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();

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
    postCall(url: string, data: any, type: string) {
      return of({
        transactions: [
          {
            fromAccount: '1224234',
            toAccount: '24234234',
            amount: '34534545',
            status: 'Active',
            transactionDate: '20/04/99',
            benefactorName: 'Mani'
          }
        ]
      });
    },
    getList(url: string) {
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
          message: 'String',
          statusCode: 200
        }
      });
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionComponent],
      imports: [SharedModuleModule, HttpClientTestingModule],
      providers: [
        { provide: Service, useValue: MockUserService },
        { provide: FormBuilder, useValue: formBuilder },
        UrlConfig]
    })
      .compileComponents();
    api = TestBed.get(Service);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('should check form creation while ngOnInit ', () => {
  //   component.ngOnInit();
  //   component.transaction = formBuilder.group({
  //     accountNumber: ['', Validators.required],
  //     favoriteName: ['', Validators.required],
  //     ifscCode: ['', Validators.required],
  //   });
  //   expect(component.transaction.valid).toBeFalsy();
  // });

  // it('should validate get summary details', () => {
  //   component.transaction.controls.fromMonth.setValue('Mani');
  //   component.transaction.controls.fromYear.setValue('Mani');
  //   component.transaction.controls.type.setValue('IFSC0001');
  //   component.submitted = true;
  //   component.getSummary();
  //   expect(component.transaction.valid).toBeTruthy();
  // });

  // it('Should validate modal action as Ok', () => {
  //   const action = 'Ok';
  //   component.modalAction(action);
  //   api.alertConfigDefaultValue();
  // });
});
