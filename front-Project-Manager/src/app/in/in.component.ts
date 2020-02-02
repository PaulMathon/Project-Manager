import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-in',
  templateUrl: './in.component.html',
  styleUrls: ['./in.component.css']
})
export class InComponent implements OnInit {

  user: User;

  constructor() { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }

}
