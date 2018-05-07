import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full'},
  { path: 'users/:id', component: UserDashboardComponent,
    children: [
      { path: 'profile', component: UserProfileComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full'},
      { path: 'edit', component: UserEditComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
