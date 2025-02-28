import { UserIssuedTableRowComponent } from '@/app/components/user-issued-table-row/user-issued-table-row.component';
import { Book } from '@/app/models/book';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-issued-list',
  imports: [
    CommonModule,
    RouterLink,
    UserIssuedTableRowComponent
  ],
  templateUrl: './users-issued-list.component.html',
  styleUrl: './users-issued-list.component.css'
})
export class UsersIssuedListComponent {

  users: User[] = [];
  books!: Book[];

  constructor(private userService: UserService, private bookService: BookService){
    
  }

  ngOnInit(){

    this.userService.getBorrowedUsers().subscribe(users=> {
      this.users = users;
    })
  
  //  this.bookService.books.subscribe(books=>{
  //   this.books = books;
  //   this.books.forEach(book=>{
  //     if(book.borrowedBy){
  //       book.borrowedBy.forEach(borrowing=>{
  //         this.users.push(borrowing);        
  //       })
  //     }
  //   })
  //   console.log('borrowed users', this.users)
  //  })
   

  }

}
