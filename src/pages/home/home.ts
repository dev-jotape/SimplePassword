import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { ScanResultPage } from "../scan-result/scan-result.ts";
// import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from "@ionic-native/google-plus";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  senhas: Array<any> = [];
  id: string;
  public scannedText: string;
  public buttonText: string;
  public loading: boolean;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController, 
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private _barcodeScanner: BarcodeScanner,
    // private facebook: Facebook,
    private googlePlus: GooglePlus,
  ) {
    this.getId();
  }

  scanBarCode () {
    this.buttonText = "Loading..";
    this.loading = true;

    this._barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData.cancelled) {
        console.log("User cancelled the action!");
        this.buttonText = "Scan";
        this.loading = false;
        return false;
      }
      console.log("Scanned successfully!");
      console.log(barcodeData);
      let result = barcodeData.text
      let empresaId = result.split('_')[0]
      let empresaNome = result.split('_')[1]
      let imagem = result.split('_')[2]
      let senha = result.split('_')[3]
      let estimado = result.split('_')[4]
      this.getUltimaSenha (empresaId, empresaNome, imagem, senha, estimado)
    }, (err) => {
      console.log(err);
    });
  }

  async getUltimaSenha (empresaId, empresaNome, imagem, senha, estimado) {
    var bd = firebase.database().ref('users/' + this.id + '/senhas')
    let ultimaSenha = 0
    await bd.on('child_added', (data) => {
        ultimaSenha = parseInt(data.key);
        ultimaSenha++
    });
    this.gerarSenha(empresaId, empresaNome, imagem, senha, estimado, ultimaSenha)
  }

  async gerarSenha (idEmpresa, nome, imagem, senha, estimado, ultimaSenha) {
    firebase.database().ref('users/' + this.id + '/senhas/' + ultimaSenha).set({
        nrSenha: senha,
        empresa: nome,
        estimado: estimado,
        imagem: imagem
    });
    let alert = this.alertCtrl.create({
      title: 'Nova senha gerada!',
      subTitle: 'Uma nova senha para '+ nome + ' foi gerada! Você pode visualiza-la na aba SENHAS',
      buttons: ['OK']
    });
    alert.present();
    this.initializeItems(this.id)
  }
  // private goToResult(barcodeData) {
  //   this.navCtrl.push(ScanResultPage, {
  //     scannedText: barcodeData.text
  //   });
  // }

  async getId() {
    let idUser
    await firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.id = user.uid
        this.initializeItems(this.id)
      } 
      // else {
      //   this.facebook.getLoginStatus().then(res => {
      //     if (res.authResponse.userID) {
      //       return res.authResponse.userID
      //     }
      //   })
      // }
    })

    if (!idUser) {
      this.googlePlus.trySilentLogin({})
      .then(user => {
        if(user) {
          this.id = user.userId
          this.initializeItems(this.id)
        }
      })
      .catch(err => {
        // alert(JSON.stringify(err))
      })
    }
  }

  async initializeItems (id) {
    //Loading 
    let loading
    loading = this.loadingCtrl.create({
      content: 'Carregando...'
    })
    loading.present()
    this.senhas = [];
    //trazer do banco a referencia da tabela empresas
    var bd = firebase.database().ref('users/' +  id + '/senhas')
    //percorrer a tabela empresas e gravar cada empresa em this.empresas
    // let nrsenha, empresa, estimado = ''
    await bd.on('child_added', (data) => {
      this.senhas.push({ 
        "key": data.key, 
        "empresa": data.val().empresa, 
        "nrSenha": data.val().nrSenha, 
        "estimado": data.val().estimado,
        "imagem": data.val().imagem
      })
    });
    console.log('senhas -> ', this.senhas)
    //para Loading
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
    
  }

  showConfirm(key) {
    let confirm = this.alertCtrl.create({
      title: "Cancelar senha?",
      message: 'Deseja realmente cancelar esta senha?',
      buttons: [
        {
          text: 'NÃO',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'SIM',
          handler: () => {
            this.excluirSenha(key)
          }
        }
      ]
    });
    confirm.present();
  }

  displayContents(err, text){
    if(err){
      // an error occurred, or the scan was canceled (error code `6`)
    } else {
      // The scan completed, display the contents of the QR code:
      // alert(text);
    }
  }

  async excluirSenha(index) {
    console.log('index-> ', index)
    console.log('id-> ', this.id)
    let id = this.id
    firebase.database().ref('users/' + id + '/senhas/' + index).remove()
    this.initializeItems(id);    
  }

  // presentModal() {
  //   let modal = this.modalCtrl.create(NovasenhaPage);
  //   modal.present();
  // }


}
