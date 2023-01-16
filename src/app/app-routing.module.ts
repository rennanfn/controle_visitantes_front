import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendamentoComponent } from './components/agendamento/agendamento.component';
import { EditarAgendamentoComponent } from './components/editar-agendamento/editar-agendamento.component';
import { EditarVisitanteComponent } from './components/editar-visitante/editar-visitante.component';
import { ListarAgendamentoComponent } from './components/listar-agendamento/listar-agendamento.component';
import { LoginComponent } from './components/login/login.component';
import { VisitanteBuscaComponent } from './components/visitante-busca/visitante-busca.component';
import { VisitanteComponent } from './components/visitante/visitante.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'listarAgendamento',
    component: ListarAgendamentoComponent,
  },
  {
    path: 'agendamento',
    component: AgendamentoComponent,
  },
  {
    path: 'visitante',
    component: VisitanteComponent,
  },
  {
    path: 'busca-visitante',
    component: VisitanteBuscaComponent,
  },
  {
    path: 'editar/:cod_visitante',
    component: EditarVisitanteComponent,
  },
  {
    path: 'editarAgendamento/:cod_agendamento',
    component: EditarAgendamentoComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
