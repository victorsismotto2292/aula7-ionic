import { Component } from '@angular/core';

// NOVAS EXTENSÕES:
import { DataService, Item } from '../services/data.service';
import { Data, Router } from '@angular/router';
import { AlertController } from '@ionic/angular/lazy';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  items: Item[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(){
    this.dataService.getItems().subscribe(res => {
      this.items = res;
    })
  }

  // Adicionar item:
  addItem(){
    this.router.navigateByUrl('/item-detail');
  }

  // Editar item:
  editItem(item: Item){
    this.router.navigateByUrl(`/item-detail/${item.id}`);
  }

  // Excluir item (forma assíncrona):
  async deleteItem(id: string){
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esse item?',
      buttons:[
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          handler: () => {
            this.dataService.deleteItem(id);
          },
        },
      ],
    });
    await alert.present();
  }

}
