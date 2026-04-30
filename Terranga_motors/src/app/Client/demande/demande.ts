import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environnement';

interface Vehicule {
  id: number;
  modele: string;
  id_marque: number;
  rappel_marque: string;
}

@Component({
  selector: 'app-demande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demande.html',
  styleUrl: './demande.scss'
})
export class DemandeComponent implements OnInit {
  // Objet pour stocker les données du formulaire
  demande = {
    marque: '',
    modele: '',
    annee: '',
    description: ''
  };

  // Données pour les menus déroulants dynamiques
  allVehicules: Vehicule[] = [];
  marques: string[] = [];
  modelesFiltr: string[] = [];

  // États de l'interface utilisateur
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadModeles();
  }

  /**
   * 1. Charge les marques et modèles depuis le backend
   */
  loadModeles(): void {
    this.http.get<Vehicule[]>(`${environment.apiUrl}/modeles/all`).subscribe({
      next: (data) => {
        this.allVehicules = data;
        // Extrait les marques uniques et les trie par ordre alphabétique
        this.marques = [...new Set(data.map(v => v.rappel_marque))].sort();
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des modèles :', err);
        this.errorMessage = "Impossible de charger la liste des véhicules.";
      }
    });
  }

  /**
   * 2. Filtre les modèles dès que la marque change
   */
  onMarqueChange(): void {
    this.demande.modele = ''; // Réinitialise le modèle sélectionné
    this.modelesFiltr = this.allVehicules
      .filter(v => v.rappel_marque === this.demande.marque)
      .map(v => v.modele)
      .sort();
  }

  /**
   * 3. Envoie la demande au backend (NodeMailer)
   */
  onSendDemande(): void {
    const userRaw = localStorage.getItem('currentUser');

    // Vérification de la connexion de l'utilisateur
    if (!userRaw) {
      this.errorMessage = "⚠️ Vous devez être connecté pour envoyer une demande.";
      return;
    }

    const currentUser = JSON.parse(userRaw);

    // On verrouille l'interface pendant l'envoi
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Préparation de l'objet final pour le contrôleur demande.controller.js
    const payload = {
      nom: `${currentUser.prenom} ${currentUser.nom}`,
      email: currentUser.mail,
      telephone: currentUser.telephone || 'Non renseigné',
      marque: this.demande.marque,
      modele: this.demande.modele,
      annee: this.demande.annee,
      description: this.demande.description
    };

    // Appel API vers le service Nodemailer du Backend
    this.http.post(`${environment.apiUrl}/demande`, payload).subscribe({
      next: (res) => {
        console.log('✅ Email envoyé :', res);
        this.isLoading = false;
        this.successMessage = "✅ Votre demande a été transmise avec succès à l'équipe !";

        // Réinitialisation du formulaire après succès
        this.demande = { marque: '', modele: '', annee: '', description: '' };
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = "❌ Une erreur est survenue lors de l'envoi du mail. Veuillez réessayer.";
        console.error('❌ Erreur Nodemailer :', err);
      }
    });
  }
}
