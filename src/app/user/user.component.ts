import { Component } from '@angular/core';
// Add these import
import {FormControl, FormGroup} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserserviceService } from '../service/userservice.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  
  userForm: FormGroup|any;
  data:any;
  isedit:boolean=false;
  username:any;
  usernameShow:any;

  constructor(
    private _userService:UserserviceService,
    private _toast:ToastrService
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
       'name': new FormControl(),
       'email': new FormControl,
       'phone': new FormControl(),
       'website': new FormControl()
    })
    this.getData();
  }

  getData(){
    this._userService.getData().subscribe(res=>{
      this.data = res;
    })
  }

  update(user:any){
    this.userForm.id = user.id;
    this.usernameShow = this.userForm.value.name;
    this._userService.update(this.userForm.id, this.userForm.value).subscribe(res=>{
      this.showInfo();
      this.getData();
    })
  }

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

  addmodel(){
    this.isedit=false;
    this.userForm.reset();
  }

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

  delete(index:number, user:any){
    this.userForm.id = user.id;
    this._userService.delete(this.userForm.id, user).subscribe(res=>{
      this.data.splice(index, 1);
      this.showError();
    })
  }

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