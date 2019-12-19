export interface User {
    firstName: string;
    email: string;
    gender: string;
    username: string;
    password: string;
    acceptTerms: boolean;
    id: number;
}

export interface Account {
    customer: Saving;
}
export interface Mortgage {
    mortgageId: number;
    mortgageType: string;
    interest: number;
    amount: number;
    tenure: number;
    emi: number;
}
export interface Saving {
    userId: number;
    customerName: string;
    age: number;
    salary: number;
    balance: number;
    gender: string;
    accountType: string;
    mortgage: Mortgage;
}
export interface AccountSummary {
    fromAccount: string;
    toAccount: string;
    amount: number;
    status: string;
    transactionDate: string;
}
export interface Account {
    accountNumber: number;
    accountType: string;
    balance: number;
    ifscCode: string;
    userId: number;
}
export interface CurrentUser {
    userId: number;
    role: string;
    firstName: string;
}

export interface TransactionSummary {
    transactionId: number;
    fromAccount: number;
    toAccount: number;
    amount: number;
    status: string;
    transactionDate: string;
    ifscCode: string;
    benefactorName: string;
}
export interface Option {
    name: string;
    value: string;
}
export interface UserDetail {
    id: number;
    name: string;
}
export interface Favorite {
    payeeId: number;
    accountNumber: number;
    favoriteName: string;
    bankName: string;
    ifscCode?: string;
}
export interface Bank {
    bankName: string;
    branchName: string;
    message: string;
    statusCode: number;
}
