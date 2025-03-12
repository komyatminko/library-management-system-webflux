import { Routes } from '@angular/router';
import { authRouteGuard } from './auth-route.guard';
import { HomeComponent } from './components/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { BooksIssuedListComponent } from './pages/books-issued-list/books-issued-list.component';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { IssuedBookDetailsComponent } from './pages/issued-book-details/issued-book-details.component';
import { IssuedUsersDetailsComponent } from './pages/issued-users-details/issued-users-details.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { OverdueBooksListComponent } from './pages/overdue-books-list/overdue-books-list.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UsersIssuedListComponent } from './pages/users-issued-list/users-issued-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent, canActivate : [authRouteGuard] },
    { path: 'admin', component: AdminDashboardComponent,canActivate : [authRouteGuard]},
    { path: 'user', component: UserDashboardComponent,canActivate : [authRouteGuard]},
    { path: 'admin/books', component: BooksListComponent,canActivate : [authRouteGuard]},
    { path: 'admin/books/:id/details', component: BookDetailsComponent,canActivate : [authRouteGuard]},
    { path: 'admin/issuedBooks', component: BooksIssuedListComponent,canActivate : [authRouteGuard]},
    { path: 'admin/issuedBooks/:id/details', component: IssuedBookDetailsComponent,canActivate : [authRouteGuard]},
    { path: 'admin/issuedUsers', component: UsersIssuedListComponent,canActivate : [authRouteGuard]},
    { path: 'admin/issuedUsers/:id/details', component: IssuedUsersDetailsComponent,canActivate : [authRouteGuard]},
    { path: '',   redirectTo: '/login', pathMatch: 'full' },
    { path: '**', component: NotFoundPageComponent, },
];
