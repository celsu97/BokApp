import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { BookList } from './pages/books/book-list/book-list';
import { BookForm } from './pages/books/book-form/book-form';
import { QuoteList } from './pages/quotes/quote-list/quote-list';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'books', component: BookList, canActivate: [authGuard] },
  { path: 'books/new', component: BookForm, canActivate: [authGuard] },
  { path: 'books/edit/:id', component: BookForm, canActivate: [authGuard] },
  { path: 'quotes', component: QuoteList, canActivate: [authGuard] },
  { path: '**', redirectTo: '/books' }
];
