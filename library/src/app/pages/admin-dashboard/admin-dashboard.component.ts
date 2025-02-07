import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TotalCardComponent } from "../../components/total-card/total-card.component";
import { UserListCardComponent } from "../../components/user-list-card/user-list-card.component";
import { BookListCardComponent } from "../../components/book-list-card/book-list-card.component";
import { OverDueBookListComponent } from "../../components/over-due-book-list/over-due-book-list.component";
import { BooksIssuedCardComponent } from "../../components/books-issued-card/books-issued-card.component";
import { BooksAvailableCardComponent } from "../../components/books-available-card/books-available-card.component";
import { BookService } from '@/app/services/admin/book.service';
import { Book } from '@/app/models/book';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    TotalCardComponent,
    UserListCardComponent,
    BookListCardComponent,
    OverDueBookListComponent,
    BooksIssuedCardComponent,
    BooksAvailableCardComponent
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  booksArr!: Book[];
  constructor(private bookService: BookService) {
    this.bookService.fetchBooksFromServer();
    this.bookService.books.subscribe(books => this.booksArr = books)
  }
}
