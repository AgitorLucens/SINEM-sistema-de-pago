import { useState } from "react";
import {exportTemplateStudents,importStudentsFromExcel} from "../../constant/DBFunctions.jsx"
import { DataBaseUpload, FileExcel, TrashIcon } from "../icons/Icons";
import { ArrowDownIcon } from "@radix-ui/react-icons";

import './studentimportcard.css';
const StudentImportCard = ({file,setFile,setModal,setError}) => {
    const [isDragging, setIsDragging] = useState(false);


    const isValidExcelFile = (file) => {
        if (!file) return;

        const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
            "text/csv"
        ];

        const allowedExtensions = [".xlsx", ".csv"];

        const ext = file.name?.toLowerCase().slice(file.name.lastIndexOf("."));

        return allowedTypes.includes(file.type) || allowedExtensions.includes(ext);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];

            if (!isValidExcelFile(selected)) {
                setError("Formato Invalido. Solo ingrese archivo Excel.");
                setTimeout(() => setError(""), 3000);
                return;
            }
            setError("");
            setFile(selected);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selected = e.dataTransfer.files[0];
            if (!isValidExcelFile(selected)) {
                setError("Formato Invalido. Solo ingrese archivo Excel.");
                setTimeout(() => setError(""), 3000);
                return;
            }
            setError("");
            setFile(selected);
        }
    };

    const handleImportClick = async () => {
        if (!file){
            setError("Falta archivo");
            setTimeout(setError(""),4000);
        }
        const buffer = await file.arrayBuffer();
        const students = await importStudentsFromExcel({
            name: file.name,
            buffer: Array.from(new Uint8Array(buffer)),
        });
        console.log(JSON.stringify(students));
    };


    return (
        <div>
            {!file ? (
                <>
                    <div className="info-block">
                        <p className="info-text">Selecciona o arrastra el archivo de Excel con los datos de los nuevos estudiantes.</p>
                    </div>

                    <div 
                        className={`drop-zone ${isDragging ? 'drag-active' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} />
                        <div className="icon-bg">
                            <DataBaseUpload />
                        </div>
                        <div className="drop-content">
                            <h3>Haz clic o arrastra tu archivo</h3>
                            <p>Soporta formatos .xlsx y .csv</p>
                        </div>
                    </div>

                    {/* Tarjeta de Plantilla */}
                    <div className="template-card">
                        <div className="template-left">
                            <h4>Formato Requerido</h4>
                            <p>Evita errores usando la plantilla.</p>
                        </div>
                        <button className="btn-download-link" onClick={() => exportTemplateStudents()}>
                            <ArrowDownIcon /> Descargar plantilla
                        </button>
                    </div>
                </>
            ) : (
                <div className="file-preview">
                    <FileExcel />
                    <div className="file-details">
                        <div className="file-name">{file.name}</div>
                        <div className="file-meta">{(file.size / 1024).toFixed(1)} KB • Listo para importar</div>
                    </div>
                    <button className="delete-btn-import" onClick={() => setFile(null)} title="Eliminar archivo">
                        <TrashIcon />
                    </button>
                </div>
            )}

            
                <button 
                    className={!file ? "btn-ghost-export" : "btn-primary-import"} 
                    onClick={handleImportClick}
                    disabled={!file}
                >
                    {file ? 'Importar Estudiantes' : 'Selecciona un archivo'}
                </button>
                <button className="btn-ghost-export" onClick={() => setModal(false)}>
                    Cancelar
                </button>
                
            

        </div>
    );
}

export default StudentImportCard;