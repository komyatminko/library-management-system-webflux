import { UserIssuedTableRowComponent } from '@/app/components/user-issued-table-row/user-issued-table-row.component';
import { User } from '@/app/models/user';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-issued-list',
  imports: [
    CommonModule,
    RouterLink,
    UserIssuedTableRowComponent
  ],
  templateUrl: './users-issued-list.component.html',
  styleUrl: './users-issued-list.component.css'
})
export class UsersIssuedListComponent {

  users: User[] = [];

  constructor(private userService: UserService){
    
  }

  ngOnInit(){

    this.userService.getBorrowedUsers().subscribe(users=> this.users = users)

  }

}
