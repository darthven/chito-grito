import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../../services/user.service';
import User from '../../../models/user.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.less']
})
export class UserDashboardComponent implements OnInit {

  public user$: Observable<User>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
    this.user$ = this.userService.getUser(this.route.snapshot.paramMap.get('id'));
  }

}
