import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookFormComponent } from "../../components/book-form/book-form.component";

@Component({
  selector: 'app-books-list',
  imports: [
    CommonModule,
    TableRowComponent,
    BookFormComponent,
    RouterLink,
    FormsModule
],
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.css'
})
export class BooksListComponent implements OnInit{
  
  @ViewChild('bookFrom') bookFrom!: BookFormComponent;
  searchKeyword :string = '';
  filterBooks: Book[] = [];
  originBooks: Book[] = [];
  allBooks!: Book[];

  isClickFilter = false;
  selectedGenres: string[] = [];
  genres : string[] = [
    'action',
    'sci-fi',
    'drama',
    'history',
    
  ]

  constructor(private bookService: BookService){

    
  }
  ngOnInit(): void {
    this.bookService.books.subscribe(data => {
      this.allBooks = data;
      this.filterBooks = this.allBooks;
      this.originBooks = this.allBooks;

      const storedGenres = localStorage.getItem('selectedGenres');
    if (storedGenres) {
      this.selectedGenres = JSON.parse(storedGenres);
      this.filterBooksBaseOnGenres();
    }else {
      this.selectedGenres = [];
      this.filterBooksBaseOnGenres();
    }
    });
  
    
    
  }


  editDialogEvent(book:Book)
  {
    this.bookFrom.openDialogForUpdate(book);
  }
  
  showSearchResult(){
    if(this.searchKeyword.length > 0){
      this.filterBooks = this.allBooks.filter(book => book.name.toLowerCase().includes(this.searchKeyword.toLowerCase()));   
    }
    else this.filterBooks = this.originBooks;

    
  }

  showFilterBox(){
    this.isClickFilter = !this.isClickFilter;
  }

  filterBooksBaseOnGenres(){
    if(this.selectedGenres.length > 0){
      this.filterBooks = this.allBooks.filter(book => book.bookDetails.genres.some(genre => this.selectedGenres.includes(genre.toLowerCase()))
        
      )  
    }
    else this.filterBooks = this.originBooks;
  }

  onGenreChange(event: any, genre: string){
    if (event.target.checked) {
      this.selectedGenres.push(genre.toLowerCase());
    } else {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    }
    localStorage.setItem('selectedGenres', JSON.stringify(this.selectedGenres));
    
    this.filterBooksBaseOnGenres();
  }

  isChecked(genre: string){
    return this.selectedGenres.includes(genre);
  }
}
