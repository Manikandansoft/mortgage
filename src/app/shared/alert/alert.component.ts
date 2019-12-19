import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() alertObj;
  @Output() buttonAction = new EventEmitter();
  constructor() { }

  /* Pass the button action to parent component */
  btnAction(action) {
    this.buttonAction.emit(action);
  }
  ngOnInit() {}

}
