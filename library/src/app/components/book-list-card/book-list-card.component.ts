import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/admin/book.service';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-book-list-card',
  imports: [RouterLink],
  templateUrl: './book-list-card.component.html',
  styleUrl: './book-list-card.component.css'
})
export class BookListCardComponent {

  book!: Book[];
  constructor(private router: Router, private bookService: BookService){
    this.bookService.fetchBooksFromServer();
    this.bookService.books.subscribe(books => this.book = books)
  }
  
}
