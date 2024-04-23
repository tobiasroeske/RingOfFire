import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { GameService } from '../../firebase-services/game.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss',
})
export class DialogAddPlayerComponent {
  private gameService = inject(GameService);
  public dialogRef = inject(MatDialogRef<DialogAddPlayerComponent>);
  public data: DialogData = inject(MAT_DIALOG_DATA);
  name: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }
}
