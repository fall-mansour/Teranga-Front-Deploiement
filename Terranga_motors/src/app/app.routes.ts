import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Ajoutpieces } from './Gestion/ajoutpieces/ajoutpieces';
import { Dashboard } from './Gestion/dashboard/dashboard';
import { Stock } from './Gestion/stock/stock';

import { Acceuil } from './Client/acceuil/acceuil';
import { CompteComponent } from './Client/compte/compte';
import { ConnexionComponent } from './Client/connexion/connexion';
import { PasswordComponent } from './Client/password/password';
import { DemandeComponent } from './Client/demande/demande';

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'ajoutpieces', component: Ajoutpieces },
  { path: 'stock', component: Stock },

  ///Parte Client

  { path: '', component: Acceuil },
  { path: 'login', component: ConnexionComponent },
  { path: 'compte', component: CompteComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'demande', component: DemandeComponent },
];
