import {Component} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController} from "ionic-angular";
// import {HomePage} from "../home/home";
import { TabsPage } from '../tabs/tabs';
import {RegisterPage} from '../register/register';
import firebase from 'firebase';
import { GooglePlus } from "@ionic-native/google-plus";
// import { Facebook } from '@ionic-native/facebook';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public email: string = ''
  public password: string = ''

  constructor(
    public nav: NavController, 
    public forgotCtrl: AlertController, 
    public menu: MenuController, 
    public toastCtrl: ToastController, 
    private googlePlus: GooglePlus, 
    public alertCtrl: AlertController, 
    // private facebook: Facebook
  ) {
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    console.log('email-> ', this.email)
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
    .then((user) => {
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
      let toast = this.toastCtrl.create({
        message: errorMessage,
        duration: 3000,
        position: 'top',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();
    });
  }

  // loginWithFace () {
  //   let permissions = new Array<string>();
  //    permissions = ["public_profile", "email"];

  //    this.facebook.login(permissions).then((response) => {
  //     let params = new Array<string>();

  //     this.facebook.api("/me?fields=name,email", params)
  //     .then(res => {
  //       //estou usando o model para criar os usuarios
  //       let usuario = new Usuario();
  //       usuario.nome = res.name;
  //       usuario.email = res.email;
  //       usuario.id = res.id;
  //       let cadastrado = false
          
  //       var bd = firebase.database().ref('users/');
  //       console.log('pegou referencia do banco=> ', bd)
  //       bd.on('child_added', (data) => {
  //         if(data.key === usuario.id) {
  //           cadastrado = true
  //           console.log('ja existe no banco')          
  //           this.goHome();
  //         }
  //       });

  //       if(!cadastrado) {
  //         console.log('gravando no banco')
  //         firebase.database().ref('users/' + usuario.id).set({
  //           nome: usuario.nome,
  //           email: usuario.email,
  //           celular: ' ',
  //           minutos: 10,
  //           nrFila: 5,
  //           permitePromocao: false
  //         });
  //         this.goHome()
  //       }      
        
  //     }, (error) => {
  //       alert(error);
  //       let toast = this.toastCtrl.create({
  //         message: JSON.stringify(error),
  //         duration: 3000,
  //         position: 'top',
  //         cssClass: 'dark-trans',
  //         closeButtonText: 'OK',
  //         showCloseButton: true
  //       });
  //       toast.present();
  //     })
  //   }, (error) => {
  //     alert(error);
  //   });
  // }

  loginWithGoogle () {
    let id, name, email, celular, users = []

    this.googlePlus.login({})
    .then(async user => {
      id = user.userId;
      name = user.displayName;
      email = user.email;
      celular = ' ';

      await this.verificaCadastro(id).then((res) => {
        if(res) {
          this.goHome()
        } else {
          console.log('gravando no banco')
          firebase.database().ref('users/' + id).set({
            nome: name,
            email: email,
            celular: celular,
            minutos: 10,
            nrFila: 5,
            permitePromocao: false
          });          
        }
      });
    })
    .catch(err => {
      console.log('erro-> ', err)
      let toast = this.toastCtrl.create({
        message: err,
        duration: 3000,
        position: 'top',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();
    });
  }

  verificaCadastro (id) {
    return new Promise (async (resolve, reject) => {
      var bd = firebase.database().ref('users/' + id);
      console.log('pegou referencia do banco=> ', bd)
      await bd.on('child_added', (data) => {
        console.log('val -> ', data.val())
        resolve (true)
      });
      setTimeout(() => {
        resolve (false)
      }, 2000)
    });
  }

  goHome() {
     let elements = document.querySelectorAll(".tabbar");

      if (elements != null) {
          Object.keys(elements).map((key) => {
              elements[key].style.display = '';
          });
      }
      this.nav.push(TabsPage);
  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Esqueceu a senha?',
      message: "Digite seu email para redefinição de senha.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            var auth = firebase.auth();
            var emailAddress = data.email;

            auth.sendPasswordResetEmail(emailAddress).then(() => {
              let toast = this.toastCtrl.create({
                message: 'Email de redefinição de senha enviado',
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
            }).catch((error) => {
              let toast = this.toastCtrl.create({
                message: error,
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              toast.present();
            });
            
          }
        }
      ]
    });
    forgot.present();
  }

}

export class Model {

  constructor(objeto?) {
      Object.assign(this, objeto);
  }

}

export class Usuario extends Model {
    codigo: number;
    nome: string;
    email: string;
    id: string;
}