import { RouterModule, Routes } from "@angular/router";
import { StatisticsComponent } from "./statistics.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticsRoutingModule { }
