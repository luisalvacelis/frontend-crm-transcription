import { Component } from '@angular/core';
import { HeaderCampaigns } from "../../components/header-campaigns/header-campaigns";
import { TableCampaigns } from "../../components/table-campaigns/table-campaigns";

@Component({
  selector: 'app-campaigns',
  imports: [HeaderCampaigns, TableCampaigns],
  templateUrl: './campaigns.html',
})
export class Campaigns { }
