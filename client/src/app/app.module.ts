import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatListModule, MatButtonModule, MatInputModule,
  MatTabsModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { UserService } from './services/user.service';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserProfileComponent,
    UserEditComponent,
    UserDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
