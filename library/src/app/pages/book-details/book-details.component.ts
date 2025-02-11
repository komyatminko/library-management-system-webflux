import { Book } from '@/app/models/book';
import { BASE_URL } from '@/app/services/Api';
import { BookService } from '@/app/services/book/book.service';
import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-book-details',
  imports: [CommonModule,
            NgbRatingModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent{

flagForContentHeight = false;
book!: Book;
availableBookCount: number = 0;
issueBookCount: number = 0;
id:string | null= '' ;
imgUrl: string = '';
activeTab: string = 'overview';
  constructor(private route:ActivatedRoute,
              private bookService: BookService,
              private router: Router){}

  ngOnInit(){
    // console.log('ng on init')
    // this.adjustContentHeigh();

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
        }
      })
      
    });

    
  }
  
  ngAfterViewChecked() {
    if (!this.flagForContentHeight) {
      
      setTimeout(() => {
        this.calculateHeightForContent();
        this.flagForContentHeight = true;  // Ensure the timeout is not called again
      }, 100);
    }
  }
  

  calculateAvailableBookCount(): void{
    let borrowedCount = this.book.borrowedBy?.length || 0;
    this.availableBookCount = this.book.availableCount - borrowedCount;
  }

  calculateIssueBookCount(): void{
    this.issueBookCount = this.book.borrowedBy?.length || 0;
  }

  calculateHeightForContent(): void{
    const content = document.getElementById("content") as HTMLDivElement;
    const secondColumn = document.getElementById("second-column") as HTMLDivElement;
    const upperContent = document.getElementById("upperContent");
    // console.log(upperContent)

    if(upperContent && content && secondColumn){
      const secondColumnHeight = secondColumn.clientHeight;
      const upperContentHeight = upperContent.clientHeight;
      const heightForContent = secondColumnHeight - upperContentHeight;

      // console.log('actual second column height ', secondColumnHeight);
      content.style.height = heightForContent + "px";
    }
  }

  goBackToBookList(): void{
    this.router.navigate(['/admin/books'])
  }

}
