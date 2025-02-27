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

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    TotalCardComponent,
    UserListCardComponent,
    BookListCardComponent,
    OverdueBooksListCardComponent,
    BooksIssuedCardComponent,
    BooksAvailableCardComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  borrowedUsers: BorrowedUser[] = [];
  totalBookCount: number = 0;
  borrowedBookCount: number = 0;
  totalOverdueBookCount: number = 0;
  totalBorrowedUserCount: number = 0;
  constructor(private bookService: BookService,
              private userService: UserService) {
    
    
  }

  ngOnInit(){
    this.bookService.books.subscribe(books => {
      books.map(book=> {
        
        if(book){
          this.totalBookCount += book.totalCount;

          if(book.borrowedBy){
            this.borrowedBookCount += book.borrowedBy.length;
  
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
}
