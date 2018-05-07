import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormGroup, FormControl } from '@angular/forms';

import { UserService } from '../../services/user.service';
import User from '../../../models/user.model';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})
export class UserListComponent implements OnInit, OnDestroy {

  public users$: Observable<User[]>;
  public newUserForm: FormGroup;

  private checkUserSubscription: Subscription;
  private userCreateSubscription: Subscription;

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.users$ = this.userService.getAllUsers();
    this.newUserForm = new FormGroup({
      name: new FormControl()
    });
  }

  ngOnDestroy(): void {
    if (this.checkUserSubscription) {
      this.checkUserSubscription.unsubscribe();
      if (this.userCreateSubscription) {
        this.userCreateSubscription.unsubscribe();
      }
    }
  }

  public goToProfile(user: User): void {
    this.router.navigate(['users', user._id]);
  }

  public addUser(name: string): void {
    this.checkUserSubscription = this.users$.subscribe((users) => {
      if ((users.filter((user) => user.name === name).length === 0)) {
        this.userCreateSubscription = this.userService.addUser({ name })
          .subscribe(data => this.goToProfile(data));
      }
    });
  }
}
