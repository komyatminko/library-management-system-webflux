import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-issued-users-details',
  imports: [
    CommonModule,
  ],
  templateUrl: './issued-users-details.component.html',
  styleUrl: './issued-users-details.component.css'
})
export class IssuedUsersDetailsComponent {

  userId!: string;
  users!: User[];
  user!: User | undefined;
  issuedDate: string = '';
  returnDate: string = '';
  overdueDays: number = 0;
  overdueFees: number = 0;
  fromPage: string = '/admin';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private bookService: BookService){}

  ngOnInit(){
    this.route.queryParamMap.subscribe(params => {
      this.fromPage = params.get('from') || '/admin';
    })

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') || 'N/A'; 
    })

    this.userService.getBorrowedUsers().subscribe(users=> {
      this.users = users;
      this.user = users.find(user => user.id === this.userId);
      
    })
  }

  goBack(){
    this.router.navigate([this.fromPage])
  }

  formatDate(timestamp: Date){
    return this.bookService.formatDate(timestamp);
  }

  calculateOverdueDay(timestamp: Date){
    let daysInMilis = this.bookService.getOverdueDays(timestamp);
    return Math.floor(daysInMilis / (1000 * 60 * 60 * 24));
  }

  calculateOverdueFees(timestamp : Date){
    let day  = this.calculateOverdueDay(timestamp) > 0 ? this.calculateOverdueDay(timestamp) : 0;
    return this.bookService.getOverdueFee(day);
  }

}
