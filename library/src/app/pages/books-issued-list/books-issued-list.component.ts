import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookService } from '@/app/services/book/book.service';
import { Book } from '@/app/models/book';
import { TableRowComponent } from '@/app/components/table-row/table-row.component';

@Component({
  selector: 'app-books-issued-list',
  imports: [CommonModule,
            RouterLink,
            TableRowComponent
          ],
  templateUrl: './books-issued-list.component.html',
  styleUrl: './books-issued-list.component.css'
})
export class BooksIssuedListComponent {

  allBooks !: Book[];
  borrowedBooks : Book[] = [];

  constructor(private bookService: BookService){}

  ngOnInit(){

   this.borrowedBooks =  this.bookService.getBorrowedBooks();
   console.log(this.borrowedBooks)

  }

}
