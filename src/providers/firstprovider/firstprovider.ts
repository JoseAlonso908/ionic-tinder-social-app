import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the FirstproviderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


let api_user_reg_url = "http://spankrr.com/FET/"
// let api_user_reg_url = "http://fet.xxx/FET/"
// let api_user_reg_url = "http://localhost/FET"
@Injectable()
export class FirstproviderProvider {

  constructor(public http: Http) {
    console.log('Hello FirstproviderProvider Provider');
  }
  postAdminData(credentials){
    return new Promise((resolve, reject) => {
      // let headers: Headers = new Headers();
      let header = new Headers({ 'Accept':'application/json','Content-Type': 'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'X-AMZ-META-TOKEN-ID, X-AMZ-META-TOKEN-SECRET'});
      

      // headers.append("Accept", 'application/json');
      // headers.append('Content-Type', 'application/json' );
      // headers.append('Access-Control-Allow-Origin','*');
      // headers.append('Access-Control-Allow-Methods','POST, GET, OPTIONS, PUT');
      // headers.append('Access-Control-Allow-Headers', 'X-AMZ-META-TOKEN-ID, X-AMZ-META-TOKEN-SECRET');
      // let options = new RequestOptions({ headers: headers });
      this.http.post(api_user_reg_url, credentials, { headers: header }).subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }



}
