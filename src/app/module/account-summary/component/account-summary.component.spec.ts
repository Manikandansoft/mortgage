import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSummaryComponent } from './account-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { Service } from 'src/app/service/service';
import { UrlConfig } from 'src/app/service/url-config';
import { of } from 'rxjs';

describe('AccountSummaryComponent', () => {
  let component: AccountSummaryComponent;
  let fixture: ComponentFixture<AccountSummaryComponent>;
  let api: Service;
  /* create mock data for testing */
  const MockUserService = {
    isValidUser: false,
    setValidUser: (flag: boolean) => { MockUserService.isValidUser = flag; },
    currentUser: {
      userName: 'Mani',
      userId: 1,
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
    getList() {
      return of(
        [
          {
          transactions: {
            fromAccount: '1224234',
            toAccount: '24234234',
            amount: '34534545',
            status: 'Active',
            transactionDate: '20/04/99',
            benefactorName: 'Mani'
          }
        }
        ],
        [
          {
            fromAccount: '1224234',
            toAccount: '24234234',
            amount: '34534545',
            status: 'Active',
            transactionDate: '20/04/99',
            benefactorName: 'Mani'
          }
        ]
      );
    }
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSummaryComponent],
      imports: [SharedModuleModule, HttpClientTestingModule],
      providers: [{ provide: Service, useValue: MockUserService }, UrlConfig],
    })
      .compileComponents();
    api = TestBed.get(Service);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check ngOnInit', () => {
    component.ngOnInit();
  });

  describe('should show saving account', () => {
    it('saving account as true', () => {
      component.savingAccount = true;
      component.showSaving();
      expect(component.savingAccount).toEqual(false);
    });

  });

  describe('should show Mortagage account', () => {
    it('Mortagage account as true', () => {
      component.mortgageAccount = true;
      component.showMortgage();
      expect(component.mortgageAccount).toEqual(false);
    });
  });

  it('Should check modal action', () => {
    const action = 'Ok';
    component.modalAction('Ok');
    expect(action).toEqual(action);
  });

});
