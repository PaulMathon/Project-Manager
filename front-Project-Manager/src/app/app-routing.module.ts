import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SignInComponent} from './out/sign-in/sign-in.component';
import {SignUpComponent} from './out/sign-up/sign-up.component';
import {InComponent} from './in/in.component';
import {GroupsComponent} from './in/groups/groups.component';
import {NewGroupComponent} from './in/new-group/new-group.component';
import {OutComponent} from './out/out.component';
import {AuthGuard} from './guards/auth.guard';
import {GroupComponent} from './in/group/group.component';
import {InfoComponent} from './in/group/info/info.component';
import {MessageComponent} from './in/group/message/message.component';
import {ScheduleComponent} from './in/group/schedule/schedule.component';
import {ProfileComponent} from './in/profile/profile.component';
import {NotificationComponent} from './in/notification/notification.component';
import {SettingsComponent} from './in/settings/settings.component';
import { OverviewComponent } from './in/group/overview/overview.component';


const routes: Routes = [
  { path: 'out',
    component: OutComponent,
    children: [
      { path: 'signin', component: SignInComponent },
      { path: 'signup', component: SignUpComponent }
    ]},
  { path: 'in', canActivate: [AuthGuard],
    component: InComponent,
    children: [
      { path: 'groups', component: GroupsComponent },
      { path: 'groups/:id',
        component: GroupComponent,
        children: [
          { path: 'infos', component: InfoComponent },
          { path: 'chat', component: MessageComponent },
          { path: 'schedule', component: ScheduleComponent },
          { path: '', component: OverviewComponent}
        ]},
      { path: 'newgroup', component: NewGroupComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'notifications', component: NotificationComponent },
      { path: 'settings', component: SettingsComponent },

    ]},
  { path: '', redirectTo: '/out/signin', pathMatch: 'full' },
  { path: '**',  redirectTo: '/out/signin'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
