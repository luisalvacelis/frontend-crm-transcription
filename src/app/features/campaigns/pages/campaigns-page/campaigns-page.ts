import { Component } from '@angular/core';
import { HeaderCampaigns } from "../../components/header-campaigns/header-campaigns";
import { TableCampaigns } from "../../components/table-campaigns/table-campaigns";

@Component({
  selector: 'app-campaigns-page',
  imports: [HeaderCampaigns, TableCampaigns],
  templateUrl: './campaigns-page.html',
})
export class CampaignsPage { }
