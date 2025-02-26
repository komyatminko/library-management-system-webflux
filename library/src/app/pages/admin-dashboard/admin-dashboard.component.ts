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

  usersArr!: User[];
  totalBookCount: number = 0;
  borrowedBookCount: number = 0;
  totalOverdueBookCount: number = 0;
  constructor(private bookService: BookService,
              private userService: UserService) {
    
    
  }

  ngOnInit(){
    this.bookService.books.subscribe(books => {
      books.map(book=> {
        
        if(book){
          this.totalBookCount += book.totalCount;
        }
        if(book.borrowedBy){
          this.borrowedBookCount += book.borrowedBy.length;

          if(book.borrowedBy.length > 0){
            book.borrowedBy.forEach(borrowedUser => {
              if(borrowedUser.isOverdue){
                this.totalOverdueBookCount += 1;
              }
            })
          }
        }
      })
    })
    this.userService.users.subscribe(users => this.usersArr = users
    )
  }
}
