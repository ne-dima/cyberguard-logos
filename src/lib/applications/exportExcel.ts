import ExcelJS from "exceljs";
import type { Application } from "@/types/application";
import { APPLICATION_STATUS_LABELS } from "@/types/application";
import { formatBirthDateWithAge } from "@/lib/format/birthDate";

const EXPORT_HEADERS = [
  "ID",
  "ФИО",
  "Дата рождения",
  "Организация",
  "Телефон",
  "Email",
  "Контакты родителей",
  "Место жительства",
  "Хочет поступать в «ЛОГОС»",
  "Мотивационное письмо",
  "О себе",
  "Статус",
  "Комментарий отказа",
  "Приглашение отправлено",
  "Дата заявки",
] as const;

const HEADER_FILL: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFDBEAFE" },
};

function formatCreatedAt(value: string): string {
  return new Date(value).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cellDisplayLength(value: unknown): number {
  const text = value === null || value === undefined ? "" : String(value);
  return text.split("\n").reduce((max, line) => Math.max(max, line.length), 0);
}

function applicationToRow(item: Application): string[] {
  return [
    item.id,
    item.fullName,
    formatBirthDateWithAge(item.birthDate),
    item.organization,
    item.phone,
    item.email,
    item.parentContacts,
    item.location,
    item.wantsToEnroll ? "Да" : "Нет",
    item.motivationLetter,
    item.about ?? "",
    APPLICATION_STATUS_LABELS[item.status],
    item.rejectionComment ?? "",
    item.invitationSentAt ? formatCreatedAt(item.invitationSentAt) : "",
    formatCreatedAt(item.createdAt),
  ];
}

function setColumnWidths(sheet: ExcelJS.Worksheet, columnCount: number): void {
  for (let col = 1; col <= columnCount; col += 1) {
    let maxLen = 0;

    sheet.eachRow((row) => {
      maxLen = Math.max(maxLen, cellDisplayLength(row.getCell(col).value));
    });

    sheet.getColumn(col).width = Math.min(Math.max(maxLen + 2, 8), 80);
  }
}

export async function buildApplicationsWorkbook(
  applications: Application[],
): Promise<ExcelJS.Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "КиберСтраж";
  const sheet = workbook.addWorksheet("Заявки");

  sheet.addRow([...EXPORT_HEADERS]);
  const headerRow = sheet.getRow(1);
  headerRow.height = 22;

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FF1E3A5F" } };
    cell.fill = HEADER_FILL;
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    cell.border = {
      bottom: { style: "thin", color: { argb: "FFBFDBFE" } },
    };
  });

  for (const application of applications) {
    const row = sheet.addRow(applicationToRow(application));
    row.eachCell((cell) => {
      cell.alignment = { vertical: "top", wrapText: true };
    });
  }

  sheet.views = [{ state: "frozen", ySplit: 1 }];
  setColumnWidths(sheet, EXPORT_HEADERS.length);

  return workbook.xlsx.writeBuffer();
}
