import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { SystemStatsServiceService } from 'src/app/services/system-stats-service.service';
import { Space } from 'src/app/model/system/Space';
import { SystemInfo } from 'src/app/model/system/SystemInfo';
import { SystemTime } from 'src/app/model/system/SystemTime';
import { CPU } from 'src/app/model/system/CPU';
import { Memory } from 'src/app/model/system/Memory';
import { Container } from '@angular/compiler/src/i18n/i18n_ast';


@Component({
  selector: 'app-systemstats',
  templateUrl: './systemstats.component.html',
  styleUrls: ['./systemstats.component.scss']
})
export class SystemstatsComponent implements OnInit {

  systemInfo: SystemInfo;
  space: Space[];
  time: SystemTime;
  cpu: CPU;
  memory: Memory;
  containers: Container[];


  chartColors: Color[] = [
    {
      backgroundColor: ['rgb(8,224,73)', 'rgb(4,112,36)'],
      borderColor: ['rgb(8,224,73)', 'rgb(4,112,36)'],
    }
  ];

  doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  doughnutChartData: SingleDataSet = [250, 130, 70];


  constructor(private systemStatsServiceService: SystemStatsServiceService) { }

  ngOnInit() {
    this.systemStatsServiceService.getSystemInfo().subscribe(systemInfo => this.systemInfo = systemInfo);
    this.systemStatsServiceService.getSystemTime().subscribe(time => this.time = time);
    this.systemStatsServiceService.getCpu().subscribe(cpu => this.cpu = cpu);
    this.systemStatsServiceService.getMemory().subscribe(memory => this.memory = memory);
    this.systemStatsServiceService.getSpace().subscribe(space => this.space = space);
    this.systemStatsServiceService.getContainers().subscribe(containers => this.containers = containers);
  }

}
