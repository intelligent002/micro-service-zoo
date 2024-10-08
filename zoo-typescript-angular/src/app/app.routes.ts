import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectListComponent} from './components/projects/list/project-list.component';
import {ProjectCreateComponent} from './components/projects/create/project-create.component';
import {ProjectEditComponent} from './components/projects/edit/project-edit.component';
import {ProjectDeleteComponent} from './components/projects/delete/project-delete.component';

export const routes: Routes = [
  {path: '', redirectTo: 'projects', pathMatch: 'full'},
  {path: 'projects', component: ProjectListComponent},
  {path: 'project/create', component: ProjectCreateComponent},
  {path: 'project/:projectId/edit', component: ProjectEditComponent},
  {path: 'project/:projectId/delete', component: ProjectDeleteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
