import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../services/user.service';
import User from '../../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  private users: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getAllUsers().subscribe(
      (data) => this.users = data,
      (error) => console.log('Error'),
      () => console.log('Request completed')
    );
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
