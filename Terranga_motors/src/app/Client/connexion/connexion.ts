// src/app/components/connexion/connexion.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConnexionService } from '../../connexion.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss'
})
export class ConnexionComponent {
  email: string = '';
  password: string = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private router: Router,
    private connexionService: ConnexionService
  ) {}

  onSubmit() {
    // 1. Réinitialisation des états
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    // 2. Validation de base
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      this.isLoading = false;
      return;
    }

    console.log("🚀 Tentative de connexion envoyée...");

    // 3. Appel au service
    this.connexionService.login(this.email.trim(), this.password).subscribe({
      next: (res) => {
        // IMPORTANT : On arrête le chargement d'abord pour afficher le message
        this.isLoading = false;

        // On affiche un message chaleureux
        this.successMessage = `✅ Connexion réussie ! Bienvenue ${res.user.prenom}. Redirection en cours...`;

        console.log("💎 Utilisateur connecté :", res.user.prenom);

        // 4. Timer de 2.5 secondes pour laisser le temps de lire le message de succès
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500);
      },
      error: (err) => {
        this.isLoading = false;
        // On récupère le message d'erreur du backend ou un message par défaut
        this.errorMessage = err.error?.message || 'Identifiants incorrects ou problème réseau.';
        console.error("❌ Erreur de connexion :", err);
      }
    });
  }
}
