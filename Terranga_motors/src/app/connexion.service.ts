import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './environnement'; // ✅ Importation de l'environnement

@Injectable({
  providedIn: 'root',
})
export class ConnexionService {
  // ✅ Remplacement du localhost par la variable d'environnement
  // On utilise 'compte' ou 'connexion' selon ta route backend (vérifie ton server.js)
  private apiUrl = `${environment.apiUrl}/compte`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    // Note : On utilise l'endpoint /login défini dans ton backend
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res && res.user) {
          // On stocke l'objet utilisateur en texte dans le localstorage
          localStorage.setItem('currentUser', JSON.stringify(res.user));

          // Initialisation du panier si inexistant
          if (!localStorage.getItem('panier')) {
            localStorage.setItem('panier', JSON.stringify([]));
          }
        }
      }),
    );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  // Petit bonus pour ton groupe : récupérer l'utilisateur facilement
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
