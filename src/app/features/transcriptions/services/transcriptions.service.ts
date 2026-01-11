import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../../core/config/api-config.service';
import { ExcelExportOptions } from '../../../api/dtos/excel.interface';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionsService {

  constructor(
    private readonly _http: HttpClient,
    private readonly _api: ApiConfigService
  ) { }

  public exportToExcel(options: ExcelExportOptions): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    for (const sheet of options.sheets) {
      const ws = this.buildWorksheet(sheet.data, sheet.headerOrder);

      const widths = sheet.columnWidths ?? this.autoFitColumnWidths(sheet.data, sheet.headerOrder);
      if (widths?.length) {
        ws['!cols'] = widths.map(wch => ({ wch }));
      }

      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName);
    }

    const fileName = options.fileName.toLowerCase().endsWith('.xlsx')
      ? options.fileName
      : `${options.fileName}.xlsx`;

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }

  private buildWorksheet<T extends object>(data: T[], headerOrder?: string[]): XLSX.WorkSheet {
    if (!data?.length) {
      return XLSX.utils.aoa_to_sheet([['Sin datos']]);
    }

    if (!headerOrder?.length) {
      return XLSX.utils.json_to_sheet(data);
    }

    const normalized = data.map((row: any) => {
      const out: any = {};
      for (const key of headerOrder) out[key] = row?.[key] ?? '';
      return out;
    });

    return XLSX.utils.json_to_sheet(normalized, { header: headerOrder });
  }

  private autoFitColumnWidths<T extends object>(data: T[], headerOrder?: string[]): number[] {
    const keys = headerOrder?.length ? headerOrder : Object.keys(data?.[0] ?? {});
    if (!keys.length) return [];

    const widths = keys.map(k => k.length);

    for (const row of data as any[]) {
      keys.forEach((k, i) => {
        const v = row?.[k];
        const s = v === null || v === undefined ? '' : String(v);
        widths[i] = Math.max(widths[i], s.length);
      });
    }

    return widths.map(w => Math.min(Math.max(w + 2, 10), 50));
  }

}
