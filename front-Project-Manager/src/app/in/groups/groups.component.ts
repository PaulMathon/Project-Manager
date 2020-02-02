import {Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {User} from '../../../models/user.model';
import {Subscription, Observable} from 'rxjs';
import {GroupService} from '../../../services/group.service';
import {Router} from '@angular/router';
import {SearchHeaderService} from "../../../services/search-header.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy, AfterViewInit {

  user: User;

  groups: any;
  groupSubscription: Subscription;
  searchValue: string;

  randomImages: string[] = [];

  constructor(private groupService: GroupService,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private searchHeaderService: SearchHeaderService) {}

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));

    this.groupSubscription = this.groupService.groupsSubject.subscribe(
      (groupsData) => {
        this.groups = groupsData;
        this.generateImages();
      }, error => {
        console.error(error);
      }
    );
    this.groupService.getGroupsFromUser(JSON.parse(localStorage.getItem('currentUser'))._id);
    this.searchHeaderService.currentsearchHeaderContent.subscribe(searchHeaderContent => {
      this.searchValue = searchHeaderContent;
    });
    localStorage.removeItem('currentGroup');
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.groupSubscription.unsubscribe();
  }

  onNavigateToGroup(group) {
    localStorage.setItem('currentGroup', JSON.stringify(group));
    this.router.navigate(['/in/groups/' + group._id]);
  }

  private generateImages() {
    this.groups.forEach(() => {
      const randomNumber = Math.round(Math.random() * 5);
      this.randomImages.push(`../../../assets/pictures/random_${randomNumber}.jpg`);
    });
  }

  getSearchValue() {
    return this.searchValue;
  }
}
