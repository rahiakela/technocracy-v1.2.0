import {Component, Input, OnInit} from '@angular/core';
import {CoreService} from '../../service/core.service';
import {Question} from '../../../shared/model/question-model';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnInit {

  @Input()
  questionList: Question[];
  publishedOn: string;

  constructor() {

  }

  ngOnInit() {
  }

}
