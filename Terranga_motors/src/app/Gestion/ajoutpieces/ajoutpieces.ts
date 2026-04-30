import { NgFor, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environnement';

@Component({
  selector: 'app-ajoutpieces',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass],
  templateUrl: './ajoutpieces.html',
  styleUrl: './ajoutpieces.scss',
})
export class Ajoutpieces {
  // Modèle initial pour réinitialisation facile
  private readonly initialData = {
    description: '',
    categorie: '',
    marque: '',
    modele: '',
    annee: '',
    etat: '',
    prix: null,
    quantite: null,
    fournisseur: '',
  };

  // Objet lié au formulaire [(ngModel)]
  pieceData = { ...this.initialData };

  // Stockage des fichiers sélectionnés
  selectedFiles: { [key: string]: File } = {};

  constructor(private http: HttpClient) {}

  /**
   * Capture le fichier lors de la sélection dans l'input
   * @param event Événement de changement de l'input file
   * @param fieldName Nom du champ (img_principale, img1, img2, etc.)
   */
  onFileSelect(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fieldName] = file;
      console.log(`📸 Fichier prêt pour ${fieldName} :`, file.name);
    }
  }

  /**
   * Envoi des données au serveur
   */
  onSubmit() {
    // 1. Validation de sécurité côté client
    if (
      !this.selectedFiles['img_principale'] ||
      !this.selectedFiles['img1'] ||
      !this.selectedFiles['img2']
    ) {
      alert("⚠️ Attention : L'image principale et les images 1 et 2 sont obligatoires !");
      return;
    }

    // 2. Création du FormData (nécessaire pour l'envoi de fichiers)
    const formData = new FormData();

    // Ajout des champs texte
    Object.keys(this.pieceData).forEach((key) => {
      const value = (this.pieceData as any)[key];
      formData.append(key, value !== null ? value.toString() : '');
    });

    // Ajout des fichiers images
    Object.keys(this.selectedFiles).forEach((key) => {
      formData.append(key, this.selectedFiles[key]);
    });

    console.log('🚀 Envoi vers Cloudinary et la base de données...');

    // 3. Requête HTTP vers ton API Node.js
    this.http.post(`${environment.apiUrl}/pieces/ajouter`, formData).subscribe({
      next: (res: any) => {
        console.log('✅ Succès :', res);
        alert('Succès : ' + res.message);
        this.resetForm();
      },
      error: (err) => {
        console.error("❌ Erreur lors de l'envoi :", err);
        const errorMsg =
          err.error?.message || 'Le serveur ne répond pas. Vérifiez votre connexion.';
        alert('Erreur : ' + errorMsg);
      },
    });
  }

  /**
   * Réinitialise le formulaire et les fichiers
   */
  resetForm() {
    this.pieceData = { ...this.initialData };
    this.selectedFiles = {};

    // Note : Pour vider visuellement les inputs 'file' du HTML,
    // un rafraîchissement ou l'utilisation de ViewChild serait nécessaire,
    // mais les données internes sont déjà remises à zéro ici.
  }
}
