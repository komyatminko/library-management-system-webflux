import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BookFormComponent } from "../../components/book-form/book-form.component";

@Component({
  selector: 'app-books-list',
  imports: [
    CommonModule,
    TableRowComponent,
    BookFormComponent
],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent implements OnInit{
  // @ViewChild('bookFrom') bookFrom!: BookFormComponent;

  books!: Book[];

  constructor(private bookService: BookService){
    
  }
  ngOnInit(): void {
    this.bookService.books.subscribe(data => this.books = data);
   
   
  }
  // showEditDialog(book:Book)
  // {
  //   //console.log('Show edit movie ',movie);
  //   this.bookFrom.openDialogForNew();
  //   //console.log('Movieform ',this.movieForm);
  // }
  
  

}
