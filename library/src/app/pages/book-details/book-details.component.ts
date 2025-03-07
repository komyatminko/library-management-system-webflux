import { BookFormComponent } from '@/app/components/book-form/book-form.component';
import { Book } from '@/app/models/book';
import { BASE_URL } from '@/app/services/Api';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-book-details',
  imports: [CommonModule,
            NgbRatingModule,
            ],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent{

flagForContentHeight = false;
book!: Book;
totalBookCount: number = 0;
availableBookCount: number = 0;
issueBookCount: number = 0;
authorBirthday: string | undefined = '';
id:string | null= '' ;
imgUrl: string = '';
activeTab: string = 'overview';

fromPage: string | null= '';

  constructor(private route:ActivatedRoute,
              private bookService: BookService,
              private router: Router){}

  ngOnInit(){

    this.route.queryParamMap.subscribe(params => {
      this.fromPage = params.get('from');
    })

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id'); 
      this.bookService.books.subscribe(books=> {
        let book = books.filter(book=> book.id == this.id);
        book.map(obj=> {
          this.book = obj;
          this.imgUrl = BASE_URL + '/' + obj.imgUrl;
        })
        // console.log(this.book);
        if(this.book){
          
          this.calculateAvailableBookCount();
          this.calculateIssueBookCount()
          this.authorBirthday = this.bookService.formatDate(this.book.author?.birthday);
        }
      })

      
      
    });

    
  }
  
  ngAfterViewChecked() {
    // if (!this.flagForContentHeight) {
      
    //   setTimeout(() => {
    //     this.calculateHeightForContent();
    //     this.flagForContentHeight = true;  
    //   }, 100);
    // }
  }
  

  calculateAvailableBookCount(): void{
    this.totalBookCount = this.book.totalCount;

    let borrowedCount = this.book.borrowedBy?.length || 0;

    this.availableBookCount = this.totalBookCount - borrowedCount;
  }

  calculateIssueBookCount(): void{
    this.issueBookCount = this.book.borrowedBy?.length || 0;
  }

  calculateHeightForContent(): void{
    const content = document.getElementById("content") as HTMLDivElement;
    const secondColumn = document.getElementById("second-column") as HTMLDivElement;
    const upperContent = document.getElementById("upperContent");


    if(upperContent && content && secondColumn){
      const secondColumnHeight = secondColumn.clientHeight;
      const upperContentHeight = upperContent.clientHeight;
      const heightForContent = secondColumnHeight - upperContentHeight;

      content.style.height = heightForContent + "px";
    }
  }

  

  goBackToBookList(): void{
    this.router.navigate([this.fromPage])
  }

}
