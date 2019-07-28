import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';


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

   public show(message: string) {
    this.snackBarSerice.open(message, 'Dismiss', this.config);
   }
}
