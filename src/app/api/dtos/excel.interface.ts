export type ExcelSheet<T = any> = {
  sheetName: string;
  data: T[];
  headerOrder?: string[];
  columnWidths?: number[];
};

export type ExcelExportOptions<T = any> = {
  fileName: string;
  sheets: ExcelSheet<T>[];
};
