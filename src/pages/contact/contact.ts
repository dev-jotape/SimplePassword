import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
// import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from "@ionic-native/google-plus";
import firebase from 'firebase';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  id : number
  minutos; senhas: number
  promocoes: boolean
  nome; email: string
  constructor(
    public navCtrl: NavController, 
    // private facebook: Facebook, 
    public toastCtrl: ToastController, 
    private googlePlus: GooglePlus, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {
    let passou = false
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        passou = true
        this.getConfig(user.uid);
      } 
      // else {
      //   facebook.getLoginStatus().then(res => {
      //     if (res.authResponse.userID) {
      //       passou = true
      //       this.getConfig(res.authResponse.userID)
      //     }
      //   })
      // }
    })
    if(!passou) {
      googlePlus.trySilentLogin({})
      .then(user => {
        if(user) {
          this.getConfig(user.userId)
        }
      })
      .catch(err => {
        // alert(JSON.stringify(err))
      })
    }
  }

  getConfig (id) {
    this.id = id
    let loading
      loading = this.loadingCtrl.create({
        content: 'Carregando...'
      })
      loading.present()

      var bd = firebase.database().ref('users/' + id)

    //percorrer a tabela empresas e gravar cada empresa em this.empresas
    bd.on('child_added', (data) => {
      if(data.key === "email") this.email = data.val();
      if(data.key === "nome") this.nome = data.val();
      if(data.key === "minutos") this.minutos = data.val();
      if(data.key === "nrFila") this.senhas = data.val();
      if(data.key === "permitePromocao") this.promocoes = data.val();
    });

      setTimeout(() => {
        loading.dismiss();
      }, 500);
  }

  salvar() {
    firebase.database().ref('users/' + this.id).update({
      minutos: this.minutos,
      nrFila: this.senhas,
      permitePromocao: this.promocoes
    });
    let alert = this.alertCtrl.create({
      title: 'Sucesso!',
      subTitle: 'As configurações foram gravadas com sucesso!',
      buttons: ['OK']
    });
    alert.present();
  }

  logout() {
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
        Object.keys(elements).map((key) => {
            elements[key].style.display = 'none';
        });
    }
    // this.navCtrl.pop();
    // this.navCtrl.setRoot(LoginPage)
    let loading = this.loadingCtrl.create({
      content: 'Saindo...'
    })
    loading.present()
    firebase.auth().signOut();
    // this.facebook.logout();
    this.googlePlus.logout();
    document.location.href = 'index.html';
    // this.navCtrl.remove(this.navCtrl.last().index)
    //     .then(
    //       () => {
    //         alert('deu certo')
    //         this.navCtrl.setRoot(LoginPage);
    //       },
    //       error => {
    //         alert('deu ruim')
    //       }
    //     );
  }

}
