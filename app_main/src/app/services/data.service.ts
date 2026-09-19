import { Inject, Injectable } from "@angular/core";

// Importações do SDK Modular do Firestore
import{
    Firestore, // Serviço principal
    collection, // Obter referência a uma coleção
    doc, // Obter referência a um documento
    collectionData, // Obter dados de uma coleção como Observable
    docData, // Obter dados de um documento como Observable
    addDoc, // Adicionar um novo documento
    updateDoc, // Atualizar um documento
    deleteDoc, // Deletar um documento
    query, // Construir consultas
    orderBy // Ordenar resultados
} from '@angular/fire/firestore';
import { Observable } from "rxjs";
import { FirstValueFromConfig } from "rxjs/internal/firstValueFrom";

// Interface do item:
export interface Item{
    id?: string;
    name: string;
    description: string;
    createdAt?: number
}

@Injectable({
    providedIn: 'root'
})
export class DataService{
    constructor(private firestore: Firestore){}

    // Retornando todos os itens:
    getItems(): Observable<Item[]>{
        // Referência para a coleção "items":
        const itemsCollectionRef = collection(this.firestore, 'items');
        // Criando uma query para ordenar "createdAt" em ordem decrescente:
        const q = query(itemsCollectionRef, orderBy('createdAt', 'desc'));
        // Retornando dados da coleção como Observable:
        return collectionData(q, { idField: 'id' }) as Observable<Item[]>;
    }

    // Retornando um item específico pelo ID:
    getItem(id: string): Observable<Item | undefined>{
        // Referência para o documento específico:
        const itemDocRef = doc(this.firestore, `ìtems/${id}`);
        // Retornando os dados do documento como Observable:
        return docData(itemDocRef, { idField: 'id' }) as Observable<Item | undefined>;
    }

    // Adicionando um novo item:
    addItem(item: Item){
        const itemsCollectionRef = collection(this.firestore, 'items');
        // Adicionando um novo documento à coleção:
        return addDoc(itemsCollectionRef, {...item, createdAt: Date.now()});
    }

    // Atualizando um item existente
    updateItem(item: Item){
        // Referência para um documento específico
        const itemDocRef = doc(this.firestore, `items/${item.id}`);
        // Atualizando documento
        return updateDoc(itemDocRef, { name: item.name, description: item.description });
    }

    // Deletando um item específico pelo id
    deleteItem(id: string){
        // Referência para um documento específico
        const itemDocRef = doc(this.firestore, `items/${id}`);
        // Deletando documento
        return deleteDoc(itemDocRef);
    }
}