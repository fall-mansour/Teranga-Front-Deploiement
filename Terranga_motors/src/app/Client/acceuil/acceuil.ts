import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Piecevente, PiecesServicevente } from '../../Piecesvente';
import { environment } from '../../environnement';

interface Vehicule {
  id: number;
  modele: string;
  id_marque: number;
  rappel_marque: string;
}

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, RouterLink, CommonModule],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.scss',
})
export class Acceuil implements OnInit, AfterViewInit {
  pieces: Piecevente[] = [];
  allVehicules: Vehicule[] = [];
  marques: string[] = [];
  modelesFiltr: string[] = [];

  searchText: string = '';
  selectedMarque: string = '';
  selectedAnnee: string = '';
  selectedModele: string = '';
  selectedCategorie: string = '';

  // Gestion de la Modale de Détails
  showModal: boolean = false;
  selectedPiece: Piecevente | null = null;
  galleryImages: string[] = [];
  currentIndex: number = 0;
  isZoomed: boolean = false;

  constructor(
    private piecesServicevente: PiecesServicevente,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.loadPieces();
    this.loadModeles();
  }

  loadPieces(): void {
    this.piecesServicevente.getPieces().subscribe({
      next: (data: Piecevente[]) => {
        this.pieces = data;
        console.log('✅ Vitrine SmartTech Central mise à jour avec Cloudinary');
      },
      error: (err: HttpErrorResponse) => {
        console.error('❌ Erreur de connexion au serveur Node :', err.message);
      },
    });
  }

  /**
   * NETTOYAGE : Plus besoin de getSafeUrl ou DomSanitizer !
   * Les URLs Cloudinary (https) sont acceptées nativement.
   */

  loadModeles(): void {
    this.http.get<Vehicule[]>(`${environment.apiUrl}/modeles/all`).subscribe({
      next: (data) => {
        this.allVehicules = data;
        this.marques = [...new Set(data.map((v) => v.rappel_marque))].sort();
      },
      error: (err) => console.error('❌ Erreur table modeles :', err),
    });
  }

  onMarqueChange(): void {
    this.selectedModele = '';
    this.modelesFiltr = this.allVehicules
      .filter((v) => v.rappel_marque === this.selectedMarque)
      .map((v) => v.modele)
      .sort();
  }

  get filteredPieces(): Piecevente[] {
    return this.pieces.filter((piece) => {
      const search = this.searchText.toLowerCase();
      const matchesSearch =
        !this.searchText ||
        piece.marque?.toLowerCase().includes(search) ||
        piece.modele?.toLowerCase().includes(search) ||
        piece.description?.toLowerCase().includes(search);

      const matchesMarque =
        !this.selectedMarque || piece.marque?.toLowerCase() === this.selectedMarque.toLowerCase();

      const matchesAnnee = !this.selectedAnnee || piece.annee?.toString() === this.selectedAnnee;

      const matchesModele =
        !this.selectedModele || piece.modele?.toLowerCase() === this.selectedModele.toLowerCase();

      const matchesCategorie =
        !this.selectedCategorie ||
        piece.categorie?.toLowerCase() === this.selectedCategorie.toLowerCase();

      return matchesSearch && matchesMarque && matchesAnnee && matchesModele && matchesCategorie;
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initSlideshow();
    }
  }

  private initSlideshow() {
    const imagePaths = ['assets/img1.jpg', 'assets/img2.jpg', 'assets/img3.jpg'];
    const slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;

    imagePaths.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      slideshow.appendChild(img);
    });

    const images = slideshow.querySelectorAll('img');
    if (images.length === 0) return;

    let current = 0;
    images[current].classList.add('active');

    setInterval(() => {
      images[current].classList.remove('active');
      current = (current + 1) % images.length;
      images[current].classList.add('active');
    }, 5000);
  }

  /**
   * OUVERTURE DES DÉTAILS
   * Ici, on stocke directement les URLs Cloudinary reçues du backend
   */
  openDetails(piece: Piecevente) {
    this.selectedPiece = piece;
    this.currentIndex = 0;
    this.isZoomed = false;
    this.galleryImages = [];

    // On ajoute les URLs si elles existent
    if (piece.img_principale) this.galleryImages.push(piece.img_principale);
    if (piece.img1) this.galleryImages.push(piece.img1);
    if (piece.img2) this.galleryImages.push(piece.img2);
    if (piece.img3) this.galleryImages.push(piece.img3);
    if (piece.img4) this.galleryImages.push(piece.img4);

    if (this.galleryImages.length > 0) {
      this.showModal = true;
    }
  }

  /**
   * Plus besoin de concaténer /uploads/
   * On retourne l'URL telle quelle
   */
  getFullImageUrl(url: string): string {
    return url;
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }
}
