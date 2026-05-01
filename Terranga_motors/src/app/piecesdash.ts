import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environnement'; // ✅ Vérifie bien le nombre de '../' selon ton dossier

export interface StatsPieces {
  total: number;
  motorisation: number;
  transmission: number;
  freinage: number;
  suspension: number;
  carrosserie: number;
  electronique: number;
}

@Injectable({ providedIn: 'root' })
export class PiecesService {
  // ✅ Remplacement par la variable d'environnement centralisée
  private apiUrl = `${environment.apiUrl}/dashboard/stats`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<StatsPieces> {
    return this.http.get<StatsPieces>(this.apiUrl);
  }
}
