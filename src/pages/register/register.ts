import {Component} from "@angular/core";
import {NavController, AlertController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {TabsPage} from "../tabs/tabs";
import firebase from 'firebase';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  public email: string = ''
  public nome: string = ''
  public password: string = ''
  public confirmPassword: string = ''
  public celular: string = ''

  constructor(public nav: NavController, public alertCtrl: AlertController) {
  }

  // register and go to home page
  register() {
    if (this.nome !== '' && this.celular !== '') {
      if (this.password === this.confirmPassword) {
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            firebase.auth().onAuthStateChanged((user) => {
              let uid = user.uid;
              firebase.database().ref('users/' + uid).set({
                  nome: this.nome,
                  email: this.email,
                  celular: this.celular,
                  minutos: 10,
                  nrFila: 5,
                  permitePromocao: false
              });
            });
            let elements = document.querySelectorAll(".tabbar");

            if (elements != null) {
                Object.keys(elements).map((key) => {
                    elements[key].style.display = '';
                });
            }
            this.nav.setRoot(TabsPage);          
          })
          .catch((error) => {
              // Handle Errors here.
              var errorMessage = error.message;
              let alert = this.alertCtrl.create({
                title: 'Error',
                subTitle: errorMessage,
                buttons: ['OK']
              });
              alert.present();
          });
      } else {
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Senhas não conferem',
          buttons: ['OK']
        });
        alert.present();
      }
    } else {
      let alert = this.alertCtrl.create({
        title: 'Erro',
        subTitle: 'Por favor, preencha todos os campos',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }
}
