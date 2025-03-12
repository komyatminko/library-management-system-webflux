import { NotFoundComponent } from '@/app/components/not-found/not-found.component';
import { UserIssuedTableRowComponent } from '@/app/components/user-issued-table-row/user-issued-table-row.component';
import { Book } from '@/app/models/book';
import { User } from '@/app/models/user';
import { BookService } from '@/app/services/book/book.service';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-issued-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    UserIssuedTableRowComponent,
    NotFoundComponent,
  ],
  templateUrl: './users-issued-list.component.html',
  styleUrl: './users-issued-list.component.css'
})
export class UsersIssuedListComponent {

  users: User[] = [];
  originUsers: User[] = [];
  books!: Book[];
  searchKeyword: string = '';
  nothingToShow: boolean = false;

  constructor(private userService: UserService, private bookService: BookService){
    
  }

  ngOnInit(){

    this.userService.getBorrowedUsers().subscribe(users=> {
      this.users = users;
      this.originUsers = users;
    })

  }

  showSearchResult(){
    if(this.searchKeyword.length > 0){
      this.users = this.originUsers.filter(user => user.username.toLowerCase().includes(this.searchKeyword.toLowerCase()));   
      if(this.users.length == 0 ){
        this.nothingToShow = true;
      }else{
        this.nothingToShow = false;
      }
    }
    else this.users = this.originUsers;
  }
  

}
