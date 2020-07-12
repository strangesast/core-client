import {
  AfterViewChecked,
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  Injector,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  CdkPortal,
  DomPortalOutlet,
  TemplatePortal,
  PortalHost,
} from '@angular/cdk/portal';

@Component({
  selector: 'app-page-title',
  template: `
    <ng-template cdkPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: [],
})
export class PageTitleComponent implements AfterViewChecked, OnDestroy {
  private portalHost: PortalHost;

  @ViewChild(CdkPortal)
  portal: TemplatePortal<any>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  ngAfterViewChecked() {
    if (!this.portalHost?.hasAttached()) {
      this.portalHost = new DomPortalOutlet(
        document.getElementById('cdkPortalOutlet'),
        this.componentFactoryResolver,
        this.appRef,
        this.injector
      );
      this.portalHost.attach(this.portal);
    }
  }

  ngOnDestroy(): void {
    this.portalHost.detach();
  }
}
