import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/services/group.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute,
              private groupService: GroupService,
              private router: Router) { }

  id: string;

  group = {
    _id: '',
    title: '',
    description: '',
    members: '',
    startDate: '',
    endDate: '',
    meetingsDone: '',
    meetingsPlanned: ''
  };
  groupSubscription: Subscription;

  ngOnInit() {
    this.group = JSON.parse(localStorage.getItem('currentGroup'));
    this.id = this.route.snapshot.params.id;
    console.log(this.id);

    this.groupSubscription = this.groupService.groupSubject.subscribe(
      (groupData) => {
        this.group = groupData[0];
        localStorage.setItem('currentGroup', JSON.stringify(this.group));
        console.log('Here is the selected group...');
        console.log(this.group);
      }, err => {
        console.error('error : ', err);
      }
    );
    this.groupService.getGroupById(this.id);
  }

  onNavigateToGeneralInformations() {
    this.router.navigate([`/in/groups/${this.group._id}/infos`]);
  }

  onNavigateToChat() {
    this.router.navigate([`/in/groups/${this.group._id}/chat`]);
  }

  onNavigateToSchedule() {
    this.router.navigate([`/in/groups/${this.group._id}/schedule`]);
  }

  ngOnDestroy() {
    // this.groupSubscription.unsubscribe();
  }

}
