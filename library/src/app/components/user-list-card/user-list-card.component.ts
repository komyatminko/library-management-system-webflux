import { User } from '@/app/models/user';
import { UserService } from '@/app/services/user/user.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserIssuedTableRowComponent } from '../user-issued-table-row/user-issued-table-row.component';

@Component({
  selector: 'app-user-list-card',
  imports: [
    CommonModule,
    RouterLink,
    UserIssuedTableRowComponent,
  ],
  templateUrl: './user-list-card.component.html',
  styleUrl: './user-list-card.component.css'
})
export class UserListCardComponent {

  users!: User[];

  constructor(private userService: UserService){}

  ngOnInit(){

    this.userService.getBorrowedUsers().subscribe(users=> this.users = users)

  }
}
