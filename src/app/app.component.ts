import { Component, OnInit, Input } from '@angular/core';
import { Product } from './product';
import { ProductService } from './productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { PersonService } from './personService';
import { Person } from './person';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `,
  ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  persons: Person[];
  person: Person;
  personDialog: boolean;
  selectedPersons: Person[];

  //variavel login para aparecer para o usuário a próxima tela após logar
  login: boolean = false;
  //objeto usuário
  usuario = {
    nome:"",
    senha:""
  }


  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.productService.getProducts().then((data) => (this.products = data));
    this.personService.getPerson().then((data) => {
      this.persons = data;
      console.log('testeapp.component.ts'+JSON.stringify(this.persons)); // Verifica se os dados estão sendo recebidos corretamente
    });
  }

  openNew() {
    this.person = {};
    this.submitted = false;
    this.personDialog = true;
  }

  //criada função realizar login
  realizarLogin(){
    if (this.usuario.nome =="admin" && this.usuario.senha == "admin"){
      this.login = true;
    } else if (this.usuario.nome =="" || this.usuario.senha ==""){
      return alert('Os campos precisam ser preenchidos');
    }else{
      return alert('Usuário ou senha inválidos, tente novamente!')
    }
  }

  deleteSelectedPerson() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este usuário?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.persons = this.persons.filter(
          (val) => !this.selectedPersons.includes(val)
        );
        this.selectedPersons = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuário Deletado',
          life: 3000,
        });
      },
    });
  }


  editPerson(person: Person) {
    this.person = { ...person };
    this.person.born = new Date(this.person.born)
    this.personDialog = true;
  }

  deletePerson(person: Person) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar? ' + person.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.persons = this.persons.filter((val) => val.id !== person.id);
        this.person = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuário Deletado',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  savePerson() {
    this.submitted = true;

    if (this.person.name.trim()) {
      if (this.person.id) {
        this.persons[this.findIndexById(this.person.id)] = this.person;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuário atualizado',
          life: 3000,
        });
      } else {
        this.person.id = this.createId();
        this.persons.push(this.person);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Usuário Criado',
          life: 3000,
        });
      }

      this.persons = [...this.persons];
      this.personDialog = false;
      this.person = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
