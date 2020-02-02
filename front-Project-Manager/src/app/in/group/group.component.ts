import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {GroupService} from '../../../services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private groupService: GroupService) { }

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


  ngOnDestroy() {
    // this.groupSubscription.unsubscribe();
  }

}
