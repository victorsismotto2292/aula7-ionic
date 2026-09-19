import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'page-detail',
    loadChildren: () => import('./pages/page-detail/page-detail.module').then( m => m.PageDetailPageModule)
  },
  {
    path: 'item-detail/:id', // Rota para editar item existente
    loadChildren: () => import('./pages/page-detail/page-detail.module').then( m => m.PageDetailPageModule )
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
