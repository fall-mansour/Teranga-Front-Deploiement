import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment'; // 1. Import de l'environnement

export interface Piecegestion {
  _id?: string;
  id?: number; 
  marque: string;
  modele: string;
  description: string;
  prix: number;
  quantite: number;
  annee: number;
  img: string; 
  fournisseur?: string;
  etat?: string;
  categorie?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PiecesServicegestion {
  // 2. Utilisation dynamique de l'URL via l'environnement
  private apiUrl = `${environment.apiUrl}/pieces`; 

  constructor(private http: HttpClient) {}

  // Récupérer toutes les pièces depuis la BD
  getPieces(): Observable<Piecegestion[]> {
    return this.http.get<Piecegestion[]>(this.apiUrl);
  }

  // Supprimer une pièce de la BD
  deletePiece(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer une seule pièce
  getPieceById(id: string): Observable<Piecegestion> {
    return this.http.get<Piecegestion>(`${this.apiUrl}/${id}`);
  }
}
