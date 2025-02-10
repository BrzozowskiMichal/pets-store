import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PetListComponent } from './components/pet-list/pet-list.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PetListComponent,
    MatSlideToggleModule,
    MatIconModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'PETSTORE';
  isDarkMode = false;

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('dark-mode') === 'enabled';
    if (this.isDarkMode) {
      this.enableDarkMode();
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('dark-mode', 'enabled');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('dark-mode', 'disabled');
    }
  }

  private enableDarkMode(): void {
    this.renderer.addClass(document.body, 'dark-mode');
  }
}
