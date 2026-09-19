import { Component, OnInit } from '@angular/core';

// NOVAS EXTENSÕES:
import { ActivatedRoute, Router } from '@angular/router';
import { DataService, Item } from '../../services/data.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-page-detail',
  templateUrl: './page-detail.page.html',
  styleUrls: ['./page-detail.page.scss'],
  standalone: false,
})
export class ItemDetailPage implements OnInit {

  // Declarando uma propriedade 'item' do tipo Item com valores nulos.
  // Será usada para vincular os dados do formulário (nome e descrição).
  item: Item = {
    name: '',
    description: ''
  };

  // itemId -> pode ser string ou campo NULL: armazenará o ID caso estiver sendo editado
  itemId: string | null = null;
  // Flag booleana para verificar a criação de um novo item (true) ou a edição de um existente (false)
  isNewItem = true;

  constructor(
    private route:  ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id');
    // Verificando se um id foi encontrado na URL:
    if (this.itemId){
      this.isNewItem = false; // Editando um id já existente
      this.loadItem(); // Chamando método para carregar os dados do item
    }
  }

  // Carregando itens:
  async loadItem(){
    // Controle de carregamento com mensagem:
    const loading = await this.loadingController.create({
      message: 'Carregando item...'
    });
    // Loading spinner na tela:
    await loading.present();
    // Chamando método getItem do DataService para obter o item pelo id:
    this.dataService.getItem(this.itemId!).subscribe(res => {
      // Dispensando loading spinner:
      loading.dismiss();
      // Verificação item:
      if(res){
        this.item = res; // Atributos dos dados ao item;
      }
      else{
        this.presentToast('Item não encontrado', 'danger'); // Toast de erro
        this.router.navigateByUrl('/home'); // Redirecionando para a página inicial
      }
    }, err => { // Tratando erros da requisição:
      // Dispensando spinner em caso de erro:
      loading.dismiss();
      // Toast de erro genérico:
      this.presentToast('Erro ao carregar item.', 'danger');
      this.router.navigateByUrl('/home'); // Redirecionando para a página inicial
    });    
  }

  // Salvando itens:
  async saveItem(){
    // Controle de carregamento com mensagem:
    const loading = await this.loadingController.create({
      message: 'Salvando item...'
    });
    // Loading spinner na tela:
    await loading.present();

    // Verificando se a flag 'isNewItem' é verdadeira, indicando um novo item:
    if(this.isNewItem){
      // Chamando método 'addItem' do DataService caso a condição seja verdadeira:
      this.dataService.addItem(this.item).then(() => {
        // Dispensando loading spinner:
        loading.dismiss();
        // Toast de sucesso:
        this.presentToast('Erro ao adicionar item.', 'danger');
      });
    }
    else{
      // Chamando método 'updateItem' do DataService caso a condição seja falsa:
      this.dataService.updateItem(this.item).then(() => {
        // Dispensando loading spinner:
        loading.dismiss();
        // Toast de sucesso:
        this.presentToast('Item adicionado com sucesso!', 'success');
        this.router.navigateByUrl('/home'); // Redirecionando para a página inicial
      }, err => { // Tratando erros da atualização:
        // Dispensando loading spinner:
        loading.dismiss();
        // Toast de erro:
        this.presentToast('Erro ao atualizar item.', 'danger');        
      });
    }
  }

  async presentToast(message: string, color: string = 'primary'){
    // Controle de toast com a mensagem, duração e cor.
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Toast desaparecerá após 2 segundos.
      color: color // Pode ser primary, secondary, tertiary, success, danger, etc.
    });
    // Toast na tela:
    toast.present();
  }

} 