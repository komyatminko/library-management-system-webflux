import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { TableRowComponent } from '../table-row/table-row.component';

@Component({
  selector: 'app-book-list-card',
  imports: [CommonModule,
            RouterLink,
            TableRowComponent,
          ],
  templateUrl: './book-list-card.component.html',
  styleUrl: './book-list-card.component.css'
})
export class BookListCardComponent {

  books!: Book[];
  constructor(private router: Router, private bookService: BookService){
    
  }

  ngOnInit(){
    this.bookService.books.pipe(take(5)).subscribe(books => {
      this.books = books;
      // console.log(this.books);
    });

  }

  
}
