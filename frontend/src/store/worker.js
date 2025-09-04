importScripts("/excel.js");

self.onmessage = async (event) => {
  const { data, dtr, headers } = event.data;
  let result;
  try {
    if (dtr) {
      result = await generateEmployeeDtr(data, headers);
      self.postMessage({ success: true, result });
      return;
    } else {
      result = await generateExcel(data);
      self.postMessage({ success: true, result });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};

const generateExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Organizational Tree");

  const headers = [
    "Department Code",
    "Department Name",
    "Reportorial",
    "Division",
    "Group",
    "Department",
    "Section/Unit/Ward",
    "Area of Assignment",
  ];

  const headerRow = worksheet.addRow(headers);

  for (const cell of headerRow._cells) {
    if (cell) {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }
  }

  let columnWidths = [];
  for (const header of headers) {
    columnWidths.push(header.length);
  }

  for (const item of data) {
    const rowData = [
      item.code || "",
      item.codeDescription || "",
      item.division && item.divisionDescription
        ? `(${item.division}) - ${item.divisionDescription}`
        : "",
      item.division && item.divisionDescription
        ? `(${item.division}) - ${item.divisionDescription}`
        : "",
      item.group && item.groupDescription
        ? `(${item.group}) - ${item.groupDescription}`
        : "",
      item.department && item.departmentDescription
        ? `(${item.department}) - ${item.departmentDescription}`
        : "",
      item.section && item.sectionDescription
        ? `(${item.section}) - ${item.sectionDescription}`
        : "",
      item.area && item.areaOfAssignment
        ? `(${item.area}) - ${item.areaOfAssignment}`
        : "",
    ];

    const row = worksheet.addRow(rowData);

    for (const cell of row._cells) {
      if (cell) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      }
    }

    for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
      columnWidths[colIndex] = Math.max(
        columnWidths[colIndex],
        rowData[colIndex].length,
      );
    }
  }

  for (let i = 0; i < columnWidths.length; i++) {
    worksheet.getColumn(i + 1).width = columnWidths[i] + 2; // Add padding for better readability
  }

  const blob = await workbook.xlsx.writeBuffer().then(
    (data) =>
      new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
  );

  return blob;

  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(blob);
  // link.download = "OrganizationalTree.xlsx";
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};

const generateEmployeeDtr = async (data, headersItem) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Organizational Tree");

  const headers = headersItem;

  const headerRow = worksheet.addRow(headers);

  for (const cell of headerRow._cells) {
    if (cell) {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "D9D9D9" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    }
  }

  let columnWidths = [];
  for (const header of headers) {
    columnWidths.push(header.length);
  }

  for (const item of data) {
    const rowData = [
      item.name || "",
      item.code || "",
      item.dayOfWeek || "",
      item.transDateFormat || "",
      item.calendar || "",
      item.schedule || "",
      item.iN || "",
      item.oUT || "",
      item.oTTimeIN || "",
      item.oTTimeOut || "",
      item.late || "",
      item.undertime || "",
    ];

    const row = worksheet.addRow(rowData);

    for (const cell of row._cells) {
      if (cell) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      }
    }

    for (let colIndex = 0; colIndex < rowData.length; colIndex++) {
      columnWidths[colIndex] = Math.max(
        columnWidths[colIndex],
        rowData[colIndex].length,
      );
    }
  }

  for (let i = 0; i < columnWidths.length; i++) {
    worksheet.getColumn(i + 1).width = columnWidths[i] + 2; // Add padding for better readability
  }

  const blob = await workbook.xlsx.writeBuffer().then(
    (data) =>
      new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
  );

  return blob;

  // const link = document.createElement("a");
  // link.href = URL.createObjectURL(blob);
  // link.download = "OrganizationalTree.xlsx";
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};
