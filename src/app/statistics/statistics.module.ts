import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {StatisticsComponent} from './statistics.component';
import {StatisticsRoutingModule} from './statistics.routing';
import {ChartModule} from 'primeng/chart';
import {HttpClientModule} from "@angular/common/http";
import {HoymilesService} from "../services/hoymiles.service";
import {CardModule} from "primeng/card";
import {ProgressBarModule} from "primeng/progressbar";
import {StyleClassModule} from "primeng/styleclass";
import {SplitterModule} from "primeng/splitter";
import {PanelModule} from "primeng/panel";
import {AvatarModule} from "primeng/avatar";
import {ImageModule} from "primeng/image";
import {DividerModule} from "primeng/divider";
import {TooltipModule} from "primeng/tooltip";
import {FieldsetModule} from "primeng/fieldset";
import {CalendarModule} from "primeng/calendar";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    ChartModule,
    HttpClientModule,
    CardModule,
    ProgressBarModule,
    NgOptimizedImage,
    StyleClassModule,
    SplitterModule,
    PanelModule,
    AvatarModule,
    ImageModule,
    DividerModule,
    TooltipModule,
    FieldsetModule,
    CalendarModule,
    FormsModule
  ],
  declarations: [StatisticsComponent],
  providers: [HoymilesService]
})
export class StatisticsModule {
}
