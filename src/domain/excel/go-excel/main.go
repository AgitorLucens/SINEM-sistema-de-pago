package main

import (
	"fmt"
	"time"
	"github.com/xuri/excelize/v2"
)

type Payment struct{
	consecutive 	string
	date 			string
	studentName 	string
	conceptType 	string
	divisionName 	string
	paymentMethod 	string
	amount 			float64
	receipt 		string
}

func main() {
	payments := []Payment{
		{"001", "2024-01-15", "Juan Perez", "Matricula", "Primaria", "Efectivo", 1500.00, "R001"},
		{"002", "2024-01-20", "Maria Lopez", "Colegiatura", "Secundaria", "Tarjeta", 2000.00, "R002"},
		{"003", "2024-02-10", "Carlos Sanchez", "Matricula", "Primaria", "Efectivo", 1500.00, "R003"},
		{"004", "2024-02-15", "Ana Gomez", "Colegiatura", "Secundaria", "Transferencia", 2000.00, "R004"},
		{"005", "2024-03-05", "Luis Ramirez", "Matricula", "Primaria", "Efectivo", 1500.00, "R005"},
		{"006", "2024-03-10", "Sofia Torres", "Colegiatura", "Secundaria", "Tarjeta", 2000.00, "R006"},
	}

	err := CrearExcelPagosConPivotEnOtraHoja(payments)
	if err != nil {
		panic(err)
	}
}

func CrearExcelPagosConPivotEnOtraHoja(pagos []Payment) error {
	f := excelize.NewFile()
	defer f.Close()

	dataSheet := "Pagos"
	pivotSheet := "Resumen"

	// =========================
	// 1. Hoja de datos
	// =========================
	f.SetSheetName("Sheet1", dataSheet)

	f.SetSheetRow(dataSheet, "A1", &[]string{
		"Fecha",
		"Estudiante",
		"Concepto",
		"Monto",
	})

	for i, p := range pagos {
		row := i + 2

		fecha, err := time.Parse("2006-01-02", p.date)
		if err != nil {
			return err
		}

		f.SetCellValue(dataSheet, fmt.Sprintf("A%d", row), fecha)
		f.SetCellValue(dataSheet, fmt.Sprintf("B%d", row), p.studentName)
		f.SetCellValue(dataSheet, fmt.Sprintf("C%d", row), p.conceptType)
		f.SetCellValue(dataSheet, fmt.Sprintf("D%d", row), p.amount)
	}

	lastRow := len(pagos) + 1

	// Formato de fecha (CRÍTICO)
	dateStyle, _ := f.NewStyle(&excelize.Style{NumFmt: 14})
	f.SetColStyle(dataSheet, "A:A", dateStyle)

	// =========================
	// 2. Hoja de resumen
	// =========================
	f.NewSheet(pivotSheet)

	// =========================
	// 3. Tabla Pivote
	// =========================
	if err := f.AddPivotTable(&excelize.PivotTableOptions{
		DataRange:       fmt.Sprintf("%s!A1:D%d", dataSheet, lastRow),
		PivotTableRange: fmt.Sprintf("%s!A2:G30", pivotSheet),

		Rows: []excelize.PivotTableField{
			{Data: "Estudiante", DefaultSubtotal: true},
		},

		Filter: []excelize.PivotTableField{
			{Data: "Fecha"},
		},

		Columns: []excelize.PivotTableField{
			{Data: "Concepto", DefaultSubtotal: true},
		},

		Data: []excelize.PivotTableField{
			{
				Data:     "Monto",
				Name:     "Total Pagado",
				Subtotal: "Sum",
			},
		},

		// 🔒 FLAGS OBLIGATORIOS en otra hoja
		ShowRowHeaders: true,
		ShowColHeaders: true,
		ShowLastColumn: true,
		RowGrandTotals: true,
		ColGrandTotals: true,
		ShowDrill:      true,
	}); err != nil {
		return err
	}

	// =========================
	// 4. Guardar archivo
	// =========================
	return f.SaveAs("pagos_pivot_otro_sheet.xlsx")
}