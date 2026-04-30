import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from './environnement'; // ✅ Importation cruciale

export interface User {
  id: number;
  prenom: string;
  nom: string;
  mail: string;
  vehicule?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompteService {
  // ✅ On utilise maintenant la variable centralisée
  private apiUrl = `${environment.apiUrl}/compte`;

  constructor(private http: HttpClient) {}

  inscription(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res && res.user) {
          localStorage.setItem('currentUser', JSON.stringify(res.user));
        }
      }),
    );
  }

  getToken() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('panier');
  }
}
