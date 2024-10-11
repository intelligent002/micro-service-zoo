import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectListComponent} from './components/projects/list/project-list.component';

export const routes: Routes = [
  // {path: '', redirectTo: 'projects', pathMatch: 'full'},
  {path: '', component: ProjectListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
