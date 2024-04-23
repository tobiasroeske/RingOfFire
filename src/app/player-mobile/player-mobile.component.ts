import { CommonModule } from '@angular/common';
import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-player-mobile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-mobile.component.html',
  styleUrl: './player-mobile.component.scss'
})
export class PlayerMobileComponent {
  @Input() playerName!: string;
  @Input() playerImage: string[] = ['1.webp']
  @Input() playerActive: boolean = false;
}
