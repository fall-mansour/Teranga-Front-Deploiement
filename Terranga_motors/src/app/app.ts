import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Ajoutpieces } from "./Gestion/ajoutpieces/ajoutpieces";
import { Dashboard } from './Gestion/dashboard/dashboard';
import { Stock } from './Gestion/stock/stock';
import { Acceuil } from './Client/acceuil/acceuil';

@Component({
  selector: 'app-root',
  imports: [Acceuil,RouterOutlet, Ajoutpieces,Dashboard,Stock],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gestion');
}
