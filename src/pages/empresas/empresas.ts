import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
// import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

/**
 * Generated class for the EmpresasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-empresas',
  templateUrl: 'empresas.html',
})
export class EmpresasPage {
  searchQuery: string = '';
  empresas: Array<any> = [];
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController,
    // private facebook: Facebook, 
    private googlePlus: GooglePlus, 
  ) {
    this.initializeItems(true);
  }

  initializeItems (val: boolean) {
    //Loading 
    let loading
    if (val) {
      loading = this.loadingCtrl.create({
        content: 'Carregando...'
      })
      loading.present()
    }

    //zerar array de empresas
    this.empresas = []

    //trazer do banco a referencia da tabela empresas
    var bd = firebase.database().ref('empresas/')

    //percorrer a tabela empresas e gravar cada empresa em this.empresas
    bd.on('child_added', (data) => {
      this.empresas.push({
        "key": data.key,
        "endereco": data.val().endereco,
        "facebook": data.val().facebook,
        "imagem": data.val().imagem,
        "nome": data.val().nome,
        "proxSenha": data.val().proxSenha,
        "telefone": data.val().telefone,
        "tempo": data.val().tempo
      });
    });

    //para Loading
    if (val) {
      setTimeout(() => {
        loading.dismiss();
      }, 2000);
    }
    
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems(false);

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.empresas = this.empresas.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  showConfirm(i) {
    let confirm = this.alertCtrl.create({
      title: this.empresas[i].nome,
      message: 'Gerar nova senha para esta empresa?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Gerar',
          handler: () => {
            this.gerarSenha(i)
          }
        }
      ]
    });
    confirm.present();
  }

  async gerarSenha (i) {
    await this.initializeItems(false);    
    let passou = false;
    let id;
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        passou = true
        id = user.uid;
      } 
      // else {
      //   this.facebook.getLoginStatus().then(res => {
      //     if (res.authResponse.userID) {
      //       passou = true
      //       id = res.authResponse.userID
      //     }
      //   })
      // }
    });
    if(!passou) {
      await this.googlePlus.trySilentLogin({})
      .then(user => {
        if(user) {
          id = user.userId
        }
      })
    }
    console.log('id usuario em empresas -> ', id)    
    var bd = firebase.database().ref('users/' + id + '/senhas')
    let ultimaSenha = 0
    await bd.on('child_added', (data) => {
        ultimaSenha = parseInt(data.key);
        ultimaSenha++
    });
    firebase.database().ref('users/' + id + '/senhas/' + ultimaSenha).set({
        nrSenha: this.empresas[i].proxSenha,
        empresa: this.empresas[i].nome,
        estimado: this.empresas[i].tempo,
        imagem: this.empresas[i].imagem
    });
    let empresa = this.empresas[i].key
    let proxSenha = this.empresas[i].proxSenha + 1
    firebase.database().ref('empresas/' + empresa ).update({
      proxSenha: proxSenha
    });

    let alert = this.alertCtrl.create({
      title: 'Nova senha gerada!',
      subTitle: 'Uma nova senha para '+ this.empresas[i].nome + ' foi gerada! Você pode visualiza-la na aba SENHAS',
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmpresasPage');
  }

}
