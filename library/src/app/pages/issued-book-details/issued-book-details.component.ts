import { Book } from '@/app/models/book';
import { BorrowedUser } from '@/app/models/borrowed-user';
import { User } from '@/app/models/user';
import { BASE_URL } from '@/app/services/Api';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-issued-book-details',
  imports: [
    CommonModule
  ],
  templateUrl: './issued-book-details.component.html',
  styleUrl: './issued-book-details.component.css'
})
export class IssuedBookDetailsComponent {

  borrowingId!: string | null;
  borrowedUser!: BorrowedUser | undefined;
  user!: User | undefined;
  book!: Book | undefined;
  imgUrl : string = '';
  activeTab: string = 'user';
  issuedDate!: string;
  returnDate!: string;
  isOverdue: boolean = false;
  overdueDays: number = 0;
  overdueFees: number = 0;
  birthday!: string;
  fromPage!: string;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private bookService: BookService,
    private userService: UserService){}

  ngOnInit(){

    this.route.queryParamMap.subscribe(params => {
      this.fromPage = params.get('from') || '/admin';
      console.log(this.fromPage);
    })

    this.route.paramMap.subscribe(params => {
      this.borrowingId = params.get('id'); 
      this.bookService.books.subscribe(books=>{
        books.forEach((book : Book)=> {
          this.borrowedUser = book.borrowedBy?.find(borrowedUser => borrowedUser.id == this.borrowingId);
          // console.log('borrowed user', this.borrowedUser)
          if(this.borrowedUser){
            this.isOverdue = this.bookService.isOverdue(this.borrowedUser);
            // call fun about overdue
            this.showOverdueDetails(this.isOverdue)

            this.issuedDate = this.bookService.formatDate(this.borrowedUser.issueDate) || 'N/A';
            this.returnDate = this.bookService.formatDate(this.borrowedUser.returnDate) || 'N/A';

            this.userService.users.subscribe(users=>{
              this.user = users.find(user=> user.id == this.borrowedUser?.userId);
              // console.log('user ', this.user)
            })
          }
          
        })
        this.book = books.find(book=> 
          book.borrowedBy?.some(bu=> bu.id == this.borrowingId)
        )
        if(this.book){
          this.birthday = this.bookService.formatDate(this.book.author?.birthday) || 'N/A'
        }

        this.imgUrl = BASE_URL + '/' + this.book?.imgUrl;
      })

      
    })
    
  }

  goBackToIssuedBookList(){
    
  }

  showOverdueDetails(isOverdue: boolean){
    if(isOverdue && this.borrowedUser){
      
      const daysInMilis = this.bookService.getOverdueDays(this.borrowedUser?.returnDate);

      this.overdueDays = Math.floor(daysInMilis / (1000 * 60 * 60 * 24));
      this.overdueFees = this.bookService.getOverdueFee(this.overdueDays);
    }
  }

  goBack(): void{
    this.router.navigate([this.fromPage])
  }

}
