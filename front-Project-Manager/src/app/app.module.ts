import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './in/header/header.component';
import { SignInComponent } from './out/sign-in/sign-in.component';
import { SignUpComponent } from './out/sign-up/sign-up.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { UserService } from '../services/user.service';
import { ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { InComponent } from './in/in.component';
import { JwtModule } from '@auth0/angular-jwt';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {GroupsComponent} from './in/groups/groups.component';
import {NewGroupComponent} from './in/new-group/new-group.component';
import {OutComponent} from './out/out.component';
import {ClickOutsideDirective} from './directives/dropdown.directive';
import {GroupSearchFilterPipe, UserSearchFilterPipe} from './pipes/searchfilter.pipe';
import {GroupComponent} from './in/group/group.component';
import {InfoComponent} from './in/group/info/info.component';
import {MessageComponent} from './in/group/message/message.component';
import {ScheduleComponent} from './in/group/schedule/schedule.component';
import {ProfileComponent} from './in/profile/profile.component';
import {SettingsComponent} from './in/settings/settings.component';
import {NotificationComponent} from './in/notification/notification.component';
import { OverviewComponent } from './in/group/overview/overview.component';
import {SearchHeaderService} from '../services/search-header.service';
import {MatDialogModule} from '@angular/material/dialog';
import { AddMemberComponent } from './in/group/info/add-member/add-member.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ProfileOverviewComponent } from './in/group/info/profile-overview/profile-overview.component';
import { RemoveProjectDialogComponent } from './in/group/info/remove-project-dialog/remove-project-dialog.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignInComponent,
    SignUpComponent,
    InComponent,
    GroupsComponent,
    NewGroupComponent,
    OutComponent,
    ClickOutsideDirective,
    UserSearchFilterPipe,
    GroupSearchFilterPipe,
    GroupComponent,
    InfoComponent,
    MessageComponent,
    ScheduleComponent,
    ProfileComponent,
    SettingsComponent,
    NotificationComponent,
    OverviewComponent,
    AddMemberComponent,
    ProfileOverviewComponent,
    RemoveProjectDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['http://localhost:3000/auth/login']
      }
    }),
    BrowserAnimationsModule,
    MatDialogModule
  ],
  entryComponents: [
    AddMemberComponent,
    ProfileOverviewComponent,
    RemoveProjectDialogComponent
  ],
  providers: [
    UserService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    SearchHeaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
