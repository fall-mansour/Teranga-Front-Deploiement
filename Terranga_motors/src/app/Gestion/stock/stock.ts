import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Piecegestion, PiecesServicegestion } from '../../piecesgestion';
import { environment } from '../../environnement'; // ✅ Importation de l'environnement

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './stock.html',
  styleUrl: './stock.scss',
})
export class Stock implements OnInit, AfterViewInit {
  pieces: Piecegestion[] = [];

  // ✅ PLUS BESOIN de baseUrl locale ici

  searchText: string = '';
  selectedMarque: string = '';
  selectedAnnee: string = '';
  selectedModele: string = '';
  selectedCategorie: string = '';

  constructor(
    private piecesService: PiecesServicegestion,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.chargerStock();
  }

  /**
   * 1. Chargement simplifié grâce à Cloudinary
   */
  chargerStock(): void {
    this.piecesService.getPieces().subscribe({
      next: (data: any[]) => {
        // Avec Cloudinary, piece.img_principale contient déjà l'URL complète (https://res.cloudinary.com/...)
        this.pieces = data.map((piece) => {
          return {
            ...piece,
            img: piece.img_principale || 'assets/logo.jpeg',
          };
        });
        console.log('✅ Stock chargé (URLs Cloudinary)');
      },
      error: (err) => {
        console.error('❌ Erreur de récupération du stock:', err);
      },
    });
  }

  /**
   * 2. Suppression d'une pièce
   */
  supprimerPiece(id: string | number | undefined): void {
    if (id === undefined) return;
    const idToDelete = id.toString();

    if (confirm('Voulez-vous vraiment retirer cette pièce du stock définitivement ?')) {
      this.piecesService.deletePiece(idToDelete).subscribe({
        next: () => {
          // On filtre les deux IDs possibles selon ta structure SQL/NoSQL
          this.pieces = this.pieces.filter((p) => p._id !== idToDelete && p.id !== id);
          alert('✅ Pièce retirée avec succès.');
        },
        error: (err) => {
          console.error('❌ Erreur lors de la suppression:', err);
          alert('Impossible de supprimer la pièce.');
        },
      });
    }
  }

  /**
   * 3. Logique de filtrage (Reste identique mais plus performante)
   */
  get filteredPieces(): Piecegestion[] {
    return this.pieces.filter((piece) => {
      const search = this.searchText.toLowerCase();

      const matchesSearch =
        !search ||
        piece.marque?.toLowerCase().includes(search) ||
        piece.modele?.toLowerCase().includes(search) ||
        piece.description?.toLowerCase().includes(search);

      const matchesMarque = !this.selectedMarque || piece.marque === this.selectedMarque;

      const matchesAnnee = !this.selectedAnnee || piece.annee?.toString() === this.selectedAnnee;

      const matchesModele =
        !this.selectedModele ||
        piece.modele?.toLowerCase().includes(this.selectedModele.toLowerCase());

      const matchesCategorie =
        !this.selectedCategorie || piece.categorie === this.selectedCategorie;

      return matchesSearch && matchesMarque && matchesAnnee && matchesModele && matchesCategorie;
    });
  }

  // --- Gestion du Diaporama (Partie visuelle) ---
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

  goconnexion() {
    this.router.navigate(['/login']);
  }
}
