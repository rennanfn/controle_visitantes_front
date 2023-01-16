import { UserService } from './../../service/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { AgendamentoService } from './../../service/agendamento/agendamento.service';
import { AutenticacaoService } from './../../service/auth/autenticacao.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisitanteBuscaComponent } from '../visitante-busca/visitante-busca.component';
import { VisitanteComponent } from '../visitante/visitante.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css'],
})
export class AgendamentoComponent implements OnInit {
  minDate: Date;
  maxDate: Date;

  @ViewChild('visitanteSelecionado')
  filtroVisitante!: VisitanteBuscaComponent;

  agendaForm: FormGroup = this.fb.group({
    visitante: ['', [Validators.required]],
    data: ['', [Validators.required]],
    hora: ['', [Validators.required]],
    observacao: ['', []],
    status: ['', [Validators.required]],
    usuario_criacao: [this.userService.usuario.cod_usuario],
  });

  constructor(
    public dialog: MatDialog,
    private auth: AutenticacaoService,
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private toast: ToastrService,
    private router: Router,
    private userService: UserService
  ) {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  ngOnInit(): void {}

  addVisitante(): void {
    const dialogRef = this.dialog.open(VisitanteComponent, {
      minWidth: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  buscaVisitante() {
    const dialogRef = this.dialog.open(VisitanteBuscaComponent, {
      minWidth: '900px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.f.visitante.setValue(res);
    });
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      disableClose: false,
      data: {
        title: 'Finalizar Sessão?',
        body: 'Tem certeza que deseja sair do sistema?',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.auth.deslogar();
      }
    });
  }

  salvarAgendamento() {
    if (this.agendaForm.invalid) {
      this.toast.error('Preencha os campos obrigatórios!');
    } else {
      this.agendamentoService
        .salvarAgendamento(this.agendaForm.value)
        .subscribe(
          (result) => {
            this.toast.success('Agendamento cadastrado com sucesso!');
          },
          (erro) => {
            if (typeof erro.error.msg !== 'undefined') {
              this.toast.error(erro.error.msg);
              return;
            }
            this.toast.error('Erro ao cadastrar agendamento');
          }
        );
      this.agendaForm.reset;
      this.router.navigate(['/listarAgendamento']);
    }
  }

  voltarAgendamento() {
    this.router.navigate(['/listarAgendamento']);
  }

  /*selecionarVisitante(visitanteSelecionado: VisitanteSelecionado) {
    this.f.cod_visitante.setValue(visitanteSelecionado.cod_visitante);
  }*/

  get f() {
    return this.agendaForm.controls;
  }
}
