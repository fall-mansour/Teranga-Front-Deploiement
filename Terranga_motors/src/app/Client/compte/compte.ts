import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompteService } from '../../compte.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.html',
  styleUrls: ['./compte.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CompteComponent {
  prenom: string = '';
  nom: string = '';
  mail: string = '';
  password: string = '';
  telephone: string = '';
  adresse: string = '';
  marque_vehicule: string = '';
  modele_vehicule: string = '';
  annee: number | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  countdown: number = 3; // Variable pour afficher le décompte si tu le souhaites

  years: number[] = Array.from({ length: 30 }, (_, i) => 2026 - i);

  constructor(
    private router: Router,
    private compteService: CompteService
  ) {}

  creerCompte() {
    if (!this.prenom || !this.nom || !this.mail || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs obligatoires.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      prenom: this.prenom.trim(),
      nom: this.nom.trim(),
      mail: this.mail.trim().toLowerCase(),
      password: this.password,
      telephone: this.telephone || null,
      adresse: this.adresse || null,
      marque_vehicule: this.marque_vehicule || null,
      modele_vehicule: this.modele_vehicule || null,
      annee: this.annee || null
    };

    this.compteService.inscription(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        // On affiche le message de succès
        this.successMessage = res.message || "Compte créé avec succès !";

        // --- LE TIMER DE 3 SECONDES ---
        // On lance un petit intervalle pour l'aspect visuel du décompte (optionnel)
        const interval = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) clearInterval(interval);
        }, 1000);

        // La redirection effective après 3000ms (3 secondes)
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur:', err);
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'envoi.";
      }
    });
  }
}
