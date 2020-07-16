import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-objects-main-page',
  template: `
    <app-page-title>
      <a [routerLink]="['/objects']">Objects</a>
    </app-page-title>
    <header>
      <h1>Objects</h1>
    </header>
    <app-production-schedule></app-production-schedule>
    <section>
      <h2>Manufacturing Areas</h2>
      <button mat-stroked-button>Create New</button>
    </section>
    <section>
      <h2>Parts & Assemblies</h2>
      <button mat-stroked-button>Create New</button>
    </section>
    <section>
      <h2>Customers</h2>
      <button mat-stroked-button>Create New</button>
    </section>
    <section>
      <h2>Manufacturing Areas</h2>
      <button mat-stroked-button>Create New</button>
    </section>
  `,
  styleUrls: ['./objects-main-page.component.scss']
})
export class ObjectsMainPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
