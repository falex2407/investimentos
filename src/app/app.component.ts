import { Component } from '@angular/core';
import { GenericoService } from './services/generico.service';

import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CooperSystem';

  modalInvestimento = null;

  investimentos = [];

  investimento: any = { acoes: [] };

  constructor(
    private service: GenericoService,
    private modalCtrl: NgbModal
  ) {
    this.service.listInvestimentos().subscribe(res => {
      this.investimentos = res.response.data.listaInvestimentos;
    })
  }


  open(content, item, index) {
    if (item.indicadorCarencia == 'S') {
      return
    };

    this.investimento = Object.assign({}, item);

    this.calcTotalResgate();

    this.modalInvestimento = this.modalCtrl.open(content, { size: 'lg', backdrop: 'static' });
  }


  calcTotalResgate() {
    let total = 0;
    this.investimento.acoes.forEach(item => {
      if (item.valorResgate) {
        total += item.valorResgate;
      }
    });

    this.investimento.totalResgate = total
  }


  getErrors(form, i, action) {
    let error = false;
    const item = form._directives[i];
    if (item) { ///se existe dados

      const limite = action.percentual * (this.investimento.saldoTotalDisponivel / 100);
      const value = item.value ?? 0;
      error = item.touched && value > limite ? true : false;

    }
    return error;
  }

  submit(form: NgForm) {
    if (!form.valid) {
      return
    }

    if (!this.checkValidators()) {
      return;
    }

    console.log(this.investimento);

    this.confirmResgate();
  }

  checkValidators() {
    if (this.investimento.totalResgate == 0) {
      this.alertError('Informe pelo menos um dos campos a resgatar.')
      return false;
    }

    for (let action of this.investimento.acoes) {
      if (action.valorResgate) {
        const limite = action.percentual * (this.investimento.saldoTotalDisponivel / 100);

        if (action.valorResgate > limite) {
          return false;
          break;
        }
        // noError = action.valorResgate > limite ? false : true;
      }
    }

    return true;
  }

  confirmResgate() {
    Swal.fire({
      title: 'Atenção',
      icon: 'question',
      html: 'Deseja continuar com o resgate ?',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Voltar',
      showCancelButton: true,
      allowOutsideClick: false
    }).then(res => {
      if (res.isConfirmed) {
        Swal.fire({
          // title: 'Erro',
          icon: 'success',
          html: 'Resgate feito com sucesso!',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        }).then(() => {
          this.modalInvestimento.close();
        });
      }
    });
  }

  alertError(msg = '') {
    Swal.fire({
      title: 'Erro',
      icon: 'error',
      html: msg,
      confirmButtonText: 'Ok',
      allowOutsideClick: false
    });
  }
}
