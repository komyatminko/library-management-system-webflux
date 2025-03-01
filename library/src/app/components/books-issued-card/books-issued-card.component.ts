import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { BookIssuedTableRowComponent } from '../book-issued-table-row/book-issued-table-row.component';

@Component({
  selector: 'app-books-issued-card',
  imports: [
    RouterLink,
    CommonModule,
    BookIssuedTableRowComponent,
  ],
  templateUrl: './books-issued-card.component.html',
  styleUrl: './books-issued-card.component.css'
})
export class BooksIssuedCardComponent {
  allBooks!: Book[];
  flagToShowUsers:boolean = false;
  totalUsersToShow: number = 0;
  
  // isExceedFiveUsers: boolean = false;

  constructor(private bookService: BookService){}

  ngOnInit() {
    this.bookService.getBorrowedBooks().subscribe(data => {
      this.allBooks = data; 
      console.log('all borrowed books ', this.allBooks)
      this.flagToShowUsers = false;
      this.totalUsersToShow = 0;
    })
    
  }
  
}
