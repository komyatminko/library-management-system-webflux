import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TotalCardComponent } from "../../components/total-card/total-card.component";
import { UserListCardComponent } from "../../components/user-list-card/user-list-card.component";
import { BookListCardComponent } from "../../components/book-list-card/book-list-card.component";
import { BooksIssuedCardComponent } from "../../components/books-issued-card/books-issued-card.component";
import { BooksAvailableCardComponent } from "../../components/books-available-card/books-available-card.component";
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book';
import { UserService } from '@/app/services/user/user.service';
import { User } from '@/app/models/user';
import { OverdueBooksListCardComponent } from '@/app/components/overdue-books-list-card/overdue-books-list-card.component';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookFormComponent } from '@/app/components/book-form/book-form.component';
import { IssuedBookFormComponent } from '@/app/components/issued-book-form/issued-book-form.component';
import { IssuedUserFormComponent } from '@/app/components/issued-user-form/issued-user-form.component';
import { AuthService } from '@/app/services/auth.service';
import { MenuIconBtnComponent } from '@/app/components/menu-icon-btn/menu-icon-btn.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    RouterLink,
    TotalCardComponent,
    UserListCardComponent,
    BookListCardComponent,
    BooksIssuedCardComponent,
    BookFormComponent,
    IssuedBookFormComponent,
    MenuIconBtnComponent,
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  borrowedUsers: BorrowedUser[] = [];
  totalBookCount: number = 0;
  totalBorrowedBookCount: number = 0;
  totalOverdueBookCount: number = 0;
  totalBorrowedUserCount: number = 0;
  username!: string;
  isCol2Hidden = true;
  constructor(private bookService: BookService,
              private userService: UserService,
              private authService: AuthService,
              private route: ActivatedRoute) {
    
    
  }

  ngOnInit(){
    this.route.queryParamMap.subscribe(params => {
      this.username = params.get('username') || 'Unknown';
      console.log('this.user', this.username)
    })

    this.bookService.books.subscribe(books => {
      books.map(book=> {
        
        if(book){
          this.totalBookCount += book.totalCount;

          if(book.borrowedBy){
            this.totalBorrowedBookCount += book.borrowedBy.length;
  
            if(book.borrowedBy.length > 0){
              book.borrowedBy.forEach(borrowedUser => {
                if(borrowedUser.isOverdue){
                  this.totalOverdueBookCount += 1;
                }
  
                // console.log('borrowed users', borrowedUser)
                if(borrowedUser){
                  this.borrowedUsers.push(borrowedUser);
                }
                
              })
            }
            this.totalBorrowedUserCount = this.borrowedUsers
                                                .reduce((unique, user) => {
                                                  if (!unique.some(u => u.userId === user.userId)) {
                                                    unique.push(user);
                                                  }
                                                  return unique;
                                                }, [] as BorrowedUser[])
                                                .length;
          }
        }
        
      })
    })
    // this.userService.users.subscribe(users => this.borrowedUsers = users)
  }


  logout(){
    Swal.fire({
      title: "Are you sure you want to logout?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then((result) => {
      if (result.isConfirmed) {
        return this.authService.logout();
      } else {
        Swal.fire("Logout Canceled.", "", "info");
      }
    });
    
  }

  

  handleToggleCol2(isHidden: boolean): void {
    this.isCol2Hidden = isHidden; // Update the visibility based on the child's event
  }
}
