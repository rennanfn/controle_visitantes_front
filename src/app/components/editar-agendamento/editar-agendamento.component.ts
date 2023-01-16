import {
  AgendamentoInterface,
  AgendamentoService,
} from './../../service/agendamento/agendamento.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { dataDetalhesAgendamento } from './../../models/agendamento/agendamento.model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AutenticacaoService } from 'src/app/service/auth/autenticacao.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-agendamento',
  templateUrl: './editar-agendamento.component.html',
  styleUrls: ['./editar-agendamento.component.css'],
})
export class EditarAgendamentoComponent implements OnInit {
  formEditAgendamento!: FormGroup;
  agendamentoSelecionado: AgendamentoInterface[] = [];
  agendamento: AgendamentoInterface[] = [];
  listaAgendamento = false;
  exibe_msg_erro = false;
  habilita_selecao = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: dataDetalhesAgendamento,
    private fb: FormBuilder,
    public toast: ToastrService,
    private agendamentoService: AgendamentoService,
    private dialog: MatDialog,
    private auth: AutenticacaoService,
    private router: Router,
    public dialogRef: MatDialogRef<EditarAgendamentoComponent>
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.data.add_agendamento;
    this.preencherDados(this.fb, this.data.detalhes);
    //this.habilitarCamposForm(this.formEditAgendamento, true);
    this.getAgendamentoEspecifico(this.data.detalhes.cod_agendamento);
  }

  createForm() {
    this.formEditAgendamento = this.fb.group({
      cod_agendamento: new FormControl({ value: 0, disabled: true }, [
        Validators.required,
      ]),
      visitante: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      data: new FormControl({ value: '', disabled: false }, [
        Validators.maxLength(10),
      ]),
      hora: new FormControl({ value: '', disabled: false }, [
        Validators.maxLength(5),
      ]),
      observacao: new FormControl({ value: '', disabled: false }, [
        Validators.maxLength(500),
      ]),
      status: new FormControl({ value: '', disabled: false }, [
        Validators.required,
      ]),
    });
  }

  get f() {
    return this.formEditAgendamento.controls;
  }

  preencherDados(fb: FormBuilder, dados: AgendamentoInterface) {
    this.f.cod_agendamento.setValue(dados.cod_agendamento);
    this.f.visitante.setValue(dados.visitante);

    const [diaDe, mesDe, anoDe] = dados.data.split('/');
    const data = new Date(
      Number(anoDe),
      Number(mesDe) - 1,
      Number(diaDe),
      0,
      0,
      0
    );
    this.f.data.setValue(data);
    this.f.hora.setValue(dados.hora);
    this.f.observacao.setValue(dados.observacao);
    this.f.status.setValue(dados.status);
    //this.f.usuario_criacao.setValue(dados.usuario_criacao);
  }

  getAgendamentoEspecifico(cod_agendamento: number) {
    this.agendamentoService.detalhesAgendamento(cod_agendamento).subscribe(
      (retornoAgendamento) => {
        this.agendamentoSelecionado = retornoAgendamento;

        if (this.agendamentoSelecionado.length > 0) {
          const filtroAgendamento = this.agendamento.filter((age) => {
            return !this.agendamentoSelecionado.some(
              (sel) => sel.cod_agendamento === age.cod_agendamento
            );
          });
          this.agendamento = filtroAgendamento;
        }
      },
      (erro) => {
        if (typeof erro.error.msg !== 'undefined') {
          this.toast.error(erro.erro.msg);
          return;
        }
        this.toast.error('Erro ao editar agendamento');
      }
    );
  }

  addFormAgendamento(fb: FormBuilder, age: string): FormGroup {
    return fb.group({
      cod_agendamento: new FormControl(age, []),
    });
  }

  atualizaAgendamentoSelecionado(
    agendamentoSelecionado: AgendamentoInterface[]
  ) {
    const formArrayAgendamento = agendamentoSelecionado.reduce<FormArray>(
      (agesf, atual) => {
        agesf.push(
          this.addFormAgendamento(this.fb, atual.cod_agendamento.toString())
        );
        return agesf;
      },
      this.fb.array([])
    );
    this.f.listaAgendamento = formArrayAgendamento;
    if (agendamentoSelecionado.length > 0) this.exibe_msg_erro = false;
  }

  salvarEdicao() {
    if (this.formEditAgendamento.valid) {
      const form_agendamento: AgendamentoInterface =
        this.formEditAgendamento.getRawValue();
      if (
        form_agendamento.cod_agendamento === undefined ||
        form_agendamento.cod_agendamento === 0
      ) {
        this.exibe_msg_erro = true;
        return;
      }

      if (this.data.add_agendamento) {
        this.agendamentoService.salvarAgendamento(form_agendamento).subscribe(
          (retorno) => {
            this.toast.success('Agendamento incluído com sucesso!');
            this.closeDialog();
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.erro.msg);
              return;
            }
            this.toast.error('Erro ao incluir agendamento');
          }
        );
      } else {
        this.agendamentoService.updateAgendamento(form_agendamento).subscribe(
          (retorno) => {
            this.toast.success('Agendamento alterado com sucesso!');
            this.closeDialog();
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.error.msg);
              return;
            }
            this.toast.error('Erro ao alterar agendamento');
          }
        );
      }
    }
  }

  editarAgendamento() {
    this.habilitarCamposForm(this.formEditAgendamento, true);
  }

  habilitarCamposForm(form: FormGroup, ativa: boolean): void {
    if (ativa) {
      form.enable();
      this.habilita_selecao = true;
    } else {
      form.disable();
      this.habilita_selecao = false;
    }
  }

  convertDate2String(date: Date) {
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${mes}-${dia}`;
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Finalizar Sessão?',
        body: 'Tem certeza que deseja encerrar sua sessão?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.auth.deslogar();
      }
    });
  }

  voltarAgendamento() {
    this.router.navigate(['/listarAgendamento']);
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}
