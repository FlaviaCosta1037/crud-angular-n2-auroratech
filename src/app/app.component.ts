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

  realizarLogin: boolean = false;


  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.productService.getProducts().then((data) => (this.products = data));
    this.personService.getPerson().then((data) => (this.persons = data));
  }

  openNew() {
    this.person = {};
    this.submitted = false;
    this.productDialog = true;
    this.personDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter(
          (val) => !this.selectedProducts.includes(val)
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
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

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  editPerson(person: Person) {
    this.person = { ...person };
    this.person.born = new Date(this.person.born)
    this.personDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
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

  saveProduct() {
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
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.persons = [...this.persons];
      this.personDialog = false;
      this.person = {};
    }
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
