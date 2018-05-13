import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { EmpresasPage } from '../empresas/empresas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = EmpresasPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
