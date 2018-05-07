import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import User from '../../../models/user.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent implements OnInit, OnDestroy {

  public user: User;
  public userEditForm: FormGroup;

  private userSubscription: Subscription;
  private userUpdateSubscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getState().currentUser
      .subscribe((res) => this.user = res);
    this.userEditForm = new FormGroup({
      name: new FormControl(),
      age: new FormControl(),
      info: new FormControl()
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    if (this.userUpdateSubscription) {
      this.userUpdateSubscription.unsubscribe();
    }
  }

  public goToProfile(): void {
    this.router.navigate(['profile'], { relativeTo: this.route.parent });
  }

  public saveChanges(): void {
    const id: string = this.route.parent.snapshot.paramMap.get('id');
    const value = this.userEditForm.getRawValue();
    this.userUpdateSubscription = this.userService.updateUser(id, this.userEditForm.getRawValue())
      .subscribe(() => this.goToProfile());
  }

}
