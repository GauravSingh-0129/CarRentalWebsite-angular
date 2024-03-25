import { Injectable } from '@angular/core';

const TOKEN = "token";
const USER = "user";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  static saveToken(token: string): void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void{
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken(){
    return window.localStorage.getItem(TOKEN);
  }

  static getUser(){
    const userString = localStorage.getItem(USER);
    if (userString == null) {
        // Handle the case where the item is not found in localStorage
        return null; // or whatever makes sense in your application
    }
    return JSON.parse(userString);
  }

  static getUserRole():string{
    const user = this.getUser();
    if(user == null) return "";
    return user.role;
  }

  static isAdminLoggedIn(): boolean{
    if(this.getToken() == null) return false;
    const role: string = this.getUserRole();
    return role == "ADMIN";
  }

  static isCustomerLoggedIn(): boolean{
    if(this.getToken() == null) return false;
    const role: string = this.getUserRole();
    return role == "CUSTOMER";
  }

  static logout(): void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
}
