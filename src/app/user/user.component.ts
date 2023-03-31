import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
// Add these import
import {FormControl, FormGroup} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserserviceService } from '../service/userservice.service';
import { SearchPipe } from '../search.pipe';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [SearchPipe]
})
export class UserComponent {
  
  userForm: FormGroup|any;
  data:any;
  isedit:boolean=false;
  username:any;
  usernameShow:any;
  searchText: string;
  // sortBy:string;
  sortProperty: string = 'id';
  sortOrder = 1;

  constructor(
    private _userService:UserserviceService,
    private _toast:ToastrService,
    private searchPipe: SearchPipe
  ) {
    // this.sortBy = '';
    this.searchText = '';
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
       'name': new FormControl(),
       'email': new FormControl,
       'phone': new FormControl(),
       'website': new FormControl()
    })
    this.getData();
  }

  // Recherche avec sur le nom
  filteredItems(): any[] {
    return this.searchPipe.transform(this.data, this.searchText);
  }

  // Tri par colonne
  sortBy(property: string) {
    this.sortOrder = property === this.sortProperty ? (this.sortOrder * -1) : 1;
    this.sortProperty = property;
    this.data = [...this.data.sort((a: any, b: any) => {
        // sort comparison function
        let result = 0;
        if (a[property] < b[property]) {
            result = -1;
        }
        if (a[property] > b[property]) {
            result = 1;
        }
        return result * this.sortOrder;
    })];
  }

  // Affichage de l'icone selon le tri
  sortIcon(property: string) {
      if (property === this.sortProperty) {
          return this.sortOrder === 1 ? '☝️' : '👇';
      }
      return '';
  }

  // Affichage des données
  getData(){
    this._userService.getData().subscribe(res=>{
      this.data = res;
    })
  }

  // Modification d'une donnée
  update(user:any){
    this.userForm.id = user.id;
    this.usernameShow = this.userForm.value.name;
    this._userService.update(this.userForm.id, this.userForm.value).subscribe(res=>{
      this.showInfo();
      this.getData();
    })
  }

  // Enregistrement d'une donnée
  sendata(userForm:FormGroup){
    this.data.push(this.userForm.value);
    this.username = this.userForm.value.name;
    this._userService.postdata(this.userForm.value).subscribe(res=>{
      this.showSuccess();
      this.getData();
    })
  }

  submit(){

  }

  // Changement de mode pour le modal
  addmodel(){
    this.isedit=false;
    this.userForm.reset();
  }

  // Chargement des éléments du formulaire pour la modification
  edit(i:any, user:any){
    this.isedit=true;
    this.userForm.id = user.id;
    this.userForm.setValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      website: user.website
    })
  }

  // Suppression d'une donnée
  delete(index:number, user:any){
    this.userForm.id = user.id;
    this._userService.delete(this.userForm.id, user).subscribe(res=>{
      this.data.splice(index, 1);
      this.showError();
    })
  }

  // onSearch() {
  //   // const isData = this.getData();
  //   if (this.sortBy == "Name") {
  //     const filteredData = this.data.filter((u:any) => u.name.toLocaleLowerCase().startsWith(this.searchText.toLocaleLowerCase()))
  //     this.data = filteredData;
  //   }else {
  //     this.getData();
  //   }
    
  // }

  public showSuccess():void {
    this._toast.success('User Data Successfully Added', this.username);
  }
  
  public showInfo():void {
    this._toast.info('Data Has Successfully Updated', this.usernameShow);
  }
  
  public showError():void {
    this._toast.error('Data Has Deleted');
  }
}
