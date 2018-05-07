import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import User from '../../../models/user.model';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription;
  private userRemoveSubscription: Subscription;

  displayedColumns = ['Name', 'Age', 'Info'];
  user: User;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getState().currentUser.subscribe(user => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    if (this.userRemoveSubscription) {
      this.userRemoveSubscription.unsubscribe();
    }
  }

  public goToEditProfile(): void {
    this.router.navigate(['edit'], { relativeTo: this.route.parent });
  }

  public removeUser(): void {
    this.userRemoveSubscription = this.userService.removeUser(this.user._id);
  }

}
