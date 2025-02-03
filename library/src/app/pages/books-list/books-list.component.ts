import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/admin/book.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-books-list',
  imports: [
    CommonModule,
    TableRowComponent
  ],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent implements OnInit{

  books!: Book[];

  constructor(private bookService: BookService){
    this.bookService.fetchBooksFromServer();
    this.bookService.books.subscribe(data => this.books = data);
  }
  ngOnInit(): void {
   
   
  }

  
  

}
