import { OverlayRef } from '@angular/cdk/overlay';


import { filter, take } from 'rxjs/operators';

import { FilePreviewOverlayComponent } from './file-preview-overlay.component';
import { Subject, Observable } from 'rxjs';

export class FilePreviewOverlayRef {

  // tslint:disable-next-line: variable-name
  private _beforeClose = new Subject<void>();
  // tslint:disable-next-line: variable-name
  private _afterClosed = new Subject<void>();

  componentInstance: FilePreviewOverlayComponent;

  constructor(private overlayRef: OverlayRef) { }

  close(): void {
    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'start'),
      take(1)
    ).subscribe(() => {
      this._beforeClose.next();
      this._beforeClose.complete();
      this.overlayRef.detachBackdrop();
    });

    this.componentInstance.animationStateChanged.pipe(
      filter((event: any) => event.phaseName === 'done' && event.toState === 'leave'),
      take(1)
    ).subscribe(() => {
      this.overlayRef.dispose();
      this._afterClosed.next();
      this._afterClosed.complete();

      // tslint:disable-next-line: no-non-null-assertion
      this.componentInstance = null!;
    });

    this.componentInstance.startExitAnimation();
  }

  afterClosed(): Observable<void> {
    return this._afterClosed.asObservable();
  }

  beforeClose(): Observable<void> {
    return this._beforeClose.asObservable();
  }
}
