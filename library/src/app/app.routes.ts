import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { BooksIssuedListComponent } from './pages/books-issued-list/books-issued-list.component';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminDashboardComponent},
    { path: 'user', component: UserDashboardComponent},
    { path: 'admin/books', component: BooksListComponent},
    { path: 'admin/books/:id/details', component: BookDetailsComponent},
    { path: 'admin/issuedBooks', component: BooksIssuedListComponent},
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: NotFoundPageComponent },
];
