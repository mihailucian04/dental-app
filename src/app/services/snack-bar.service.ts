import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';

export const DEFAULT_CONFIG: MatSnackBarConfig = {
  verticalPosition: 'top',
  horizontalPosition: 'center',
  duration: 2000
};

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private config: MatSnackBarConfig;

  constructor(private snackBarSerice: MatSnackBar) {
    this.config = new MatSnackBarConfig();
    this.config.verticalPosition = 'top';
    this.config.horizontalPosition = 'center';
    this.config.duration = 2000;
  }

  public show(message: string, configuration?: any) {
    if (configuration) {
      this.snackBarSerice.open(message, 'Dismiss', configuration);
    } else {
      this.snackBarSerice.open(message, 'Dismiss', DEFAULT_CONFIG);
    }
  }

  public showTest(message) {
    this.snackBarSerice.open(message, '', { verticalPosition: 'bottom', horizontalPosition: 'center' });
  }

  public dismiss() {
    this.snackBarSerice.dismiss();
  }
}
