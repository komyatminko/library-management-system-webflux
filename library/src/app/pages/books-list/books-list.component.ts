import { NotFoundComponent } from '@/app/components/not-found/not-found.component';
import { TableRowComponent } from '@/app/components/table-row/table-row.component';
import { Book } from '@/app/models/book';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BookFormComponent } from "../../components/book-form/book-form.component";

@Component({
  selector: 'app-books-list',
  imports: [
    CommonModule,
    NgbPaginationModule,
    RouterLink,
    FormsModule,
    NotFoundComponent,
    TableRowComponent,
    BookFormComponent,
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

  // book10: Book[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1

  isClickFilter: boolean = false;
  nothingToShow: boolean = false;
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
    // this.bookService.books.subscribe(data => {
    //   this.allBooks = data;
    //   this.filterBooks = this.allBooks;
    //   this.originBooks = this.allBooks;

    //   const storedGenres = localStorage.getItem('selectedGenres');
    // if (storedGenres) {
    //   this.selectedGenres = JSON.parse(storedGenres);
    //   this.filterBooksBaseOnGenres();
    // }else {
    //   this.selectedGenres = [];
    //   this.filterBooksBaseOnGenres();
    // }
    // });

    this.bookService.bookUpdated$.subscribe(updatedBook => {
      this.bookService.get10Books(this.currentPage - 1, this.pageSize).subscribe(obj=>{
        this.allBooks = []
        this.allBooks = obj.data.bookList;
        this.filterBooks = this.allBooks;
        this.originBooks = this.allBooks;
        this.totalItems = obj.data.collectionSize;
        
      })
    })
  
      this.bookService.get10Books(this.currentPage - 1, this.pageSize).subscribe(obj=>{
        this.allBooks = []
        this.allBooks = obj.data.bookList;
        this.filterBooks = this.allBooks;
        this.originBooks = this.allBooks;
        this.totalItems = obj.data.collectionSize;

        this.originBooks.flatMap(book=>
          book.bookDetails.genres.map(genre => genre)
        )
        .forEach(genre=> {
          if(!this.genres.includes(genre))
          this.genres.push(genre)
        })


        const storedGenres = localStorage.getItem('selectedGenres');
      if (storedGenres) {
        this.selectedGenres = JSON.parse(storedGenres);
        this.filterBooksBaseOnGenres();
      }else {
        this.selectedGenres = [];
        this.filterBooksBaseOnGenres();
      }
      })
    
  }
  
  editDialogEvent(book:Book)
  {
    this.bookFrom.openDialogForUpdate(book);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.bookService.get10Books(this.currentPage-1, this.pageSize).subscribe(obj => {
      this.allBooks = obj.data.bookList;
      this.filterBooks = this.allBooks;
      this.originBooks = this.allBooks;
      this.totalItems = obj.data.collectionSize;
    });
  }
  
  showSearchResult(){
    if(this.searchKeyword.length > 0){
      this.filterBooks = this.allBooks.filter(book => book.name.toLowerCase().includes(this.searchKeyword.toLowerCase()));   
      if(this.filterBooks.length == 0 ){
        this.nothingToShow = true;
      }else{
        this.nothingToShow = false;
      }
    }
    else this.filterBooks = this.originBooks;

    
  }

  showFilterBox(){
    this.isClickFilter = !this.isClickFilter;
  }

  filterBooksBaseOnGenres(){
    if(this.selectedGenres.length > 0){
      this.filterBooks = this.allBooks.filter(book => book.bookDetails.genres.some(genre => this.selectedGenres.includes(genre.toLowerCase())));
      if(this.filterBooks.length == 0 ){
        this.nothingToShow = true;
      }else{
        this.nothingToShow = false;
      }  
    }
    else this.filterBooks = this.originBooks;
  }

  onGenreChange(event: any, genre: string){
    if (event.target.checked) {
      this.selectedGenres.push(genre.toLowerCase());
    } else {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
      this.nothingToShow = false;
    }
    localStorage.setItem('selectedGenres', JSON.stringify(this.selectedGenres));
    
    this.filterBooksBaseOnGenres();
  }

  isChecked(genre: string){
    return this.selectedGenres.includes(genre);
  }
}
