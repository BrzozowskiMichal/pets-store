import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PetListComponent } from './components/pet-list/pet-list.component';

@Component({
  imports: [RouterModule, PetListComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PETSTORE';
}
