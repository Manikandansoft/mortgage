import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from './service/admin-guard';
import { CutomerGuard } from './service/customer-guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import(`./module/member/member.module`).then(m => m.MemberModule)
  },
  {
    path: 'create-mortgage',
    loadChildren: () => import(`./module/mortgage/mortgage.module`)
    .then(m => m.MortgageModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'account-summary',
    loadChildren: () => import(`./module/account-summary/account-summary.module`)
    .then(m => m.AccountSummaryModule),
    canActivate: [CutomerGuard]
  },
  {
    path: 'fund-transfer',
    loadChildren: () => import(`./module/fund-transfer/fund-transfer.module`)
    .then(m => m.FundTransferModule),
   canActivate: [CutomerGuard]
  },
  {
    path: 'transaction',
    loadChildren: () => import(`./module/transaction/transaction.module`)
    .then(m => m.TransactionModule),
    canActivate: [CutomerGuard]
  },
  {
    path: 'favorite',
    loadChildren: () => import(`./module/favorite/favorite.module`)
    .then(m => m.FavoriteModule),
    canActivate: [CutomerGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
