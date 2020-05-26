import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machine-container-page',
  template: `
  <mat-toolbar>
    <span>Machines</span>
  </mat-toolbar>
  <header>
    <mat-button-toggle-group>
      <mat-button-toggle>
        <mat-icon>view_list</mat-icon>
      </mat-button-toggle>
      <mat-button-toggle>
        <mat-icon>view_module</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  </header>
  `,
  styleUrls: [
    '../container-page-formatting.scss',
    './machine-container-page.component.scss',
  ],
  styles: [
    `
    mat-toolbar {
      background: white;
    }
    `,
  ],
})
export class MachineContainerPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
