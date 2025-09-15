import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Tooltip } from "react-tooltip";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import "./MetodoLineal.css";

const MetodoMultiplicativo = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [x0, setX0] = useState(1);
  const [k, setK] = useState(0);
  const [p, setP] = useState(10);
  const [decimales, setDecimales] = useState(2);
  const [tabla, setTabla] = useState([]);
  const [m, setM] = useState(null);
  const [g, setG] = useState(null);
  const [a, setA] = useState(null);

  const campos = [
    { label: "X₀", value: x0, set: setX0, info: "Valor inicial de la serie pseudoaleatoria (debe ser > 0)" },
    { label: "K", value: k, set: setK, info: "Constante multiplicativa del método" },
    { label: "P", value: p, set: setP, info: "Cantidad de números a generar" },
    { label: "Decimales", value: decimales, set: setDecimales, info: "Cantidad de decimales de rᵢ" },
  ];

  const calcularMultiplicativo = () => {
    if (p <= 0) {
      Swal.fire("Error", "Debes ingresar un valor P > 0", "error");
      return;
    }

    if (!Number.isInteger(k)) {
      Swal.fire("Error", "K debe ser un número entero", "error");
      return;
    }

    if (x0 <= 0) {
      Swal.fire("Error", "X₀ debe ser mayor que 0", "error");
      return;
    }

    let g = Math.ceil((Math.log(p) / Math.log(2)) + 2);
    let a = 5 + 8 * k;
    let m = Math.pow(2, g);

    setG(g);
    setA(a);
    setM(m);

    let tempTabla = [];
    let xi = x0;

    for (let i = 1; i <= p + 1; i++) {
      let op = `(${a} * ${xi}) MOD ${m}`;
      let xiNext = (a * xi) % m;
      let ri = +(xiNext / (m - 1)).toFixed(decimales);
      tempTabla.push({ i, xi_1: xi, operacion: op, xi: xiNext, ri });
      xi = xiNext;
    }

    setTabla(tempTabla);
  };

  const limpiar = () => {
    setTabla([]);
    setX0(1);
    setK(0);
    setP(10);
    setDecimales(2);
    setM(null);
    setG(null);
    setA(null);
  };

  const exportarExcel = async () => {
    if (tabla.length === 0) {
      Swal.fire("Atención", "Primero genera la serie para exportar", "info");
      return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SerieMultiplicativo");
    worksheet.columns = [
      { header: "i", key: "i", width: 10 },
      { header: "Xᵢ₋₁", key: "xi_1", width: 15 },
      { header: "Operación", key: "operacion", width: 25 },
      { header: "Xᵢ", key: "xi", width: 15 },
      { header: "rᵢ", key: "ri", width: 15 },
    ];
    tabla.forEach((row) => worksheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "serie_multiplicativo.xlsx");
  };

  return (
    <>
      <Navbar />
      <div className="metodo-lineal-container">
        <div className="inputs-container">
          <div className="inputs-grid">
            {campos.map((campo, idx) => (
              <React.Fragment key={idx}>
                <label>{campo.label}:</label>
                <input
                  type="number"
                  value={campo.value}
                  onChange={(e) => campo.set(Number(e.target.value))}
                />
                <span data-tooltip-id={`tooltip-${idx}`}>🛈</span>
                <Tooltip id={`tooltip-${idx}`} place="right" effect="solid">
                  {campo.info}
                </Tooltip>
              </React.Fragment>
            ))}
          </div>

          <div className="buttons-container">
            <button className="button-blue" onClick={calcularMultiplicativo}>GENERAR</button>
            <button className="button-red" onClick={limpiar}>LIMPIAR</button>
            <button className="button-green" onClick={exportarExcel}>EXPORTAR EXCEL</button>
          </div>

          <div className="Calculo-info">
            <div className="Calculo-info-item">
              <span data-tooltip-id="tooltip-g">🛈</span>
              <Tooltip id="tooltip-g" place="left" effect="solid">
                g = Se usa para definir el módulo del generador m.
              </Tooltip>
              <strong>g =</strong> {g !== null ? g : "-"}
            </div>

            <div className="Calculo-info-item">
              <span data-tooltip-id="tooltip-a">🛈</span>
              <Tooltip id="tooltip-a" place="right" effect="solid">
                a = Constante multiplicativa.
              </Tooltip>
              <strong>a =</strong> {a !== null ? a : "-"}
            </div>

            <div className="Calculo-info-item">
              <span data-tooltip-id="tooltip-m">🛈</span>
              <Tooltip id="tooltip-m" place="right" effect="solid">
                m = Módulo del generador.
              </Tooltip>
              <strong>m =</strong> {m !== null ? m : "-"}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>i</th>
                <th>Xᵢ₋₁</th>
                <th>Operación</th>
                <th>Xᵢ</th>
                <th>rᵢ</th>
              </tr>
            </thead>
            <tbody>
              {tabla.length > 0 ? (
                tabla.map((row, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === tabla.length - 1;

                  return (
                    <tr
                      key={idx}
                      className={`${isFirst ? "highlight-first" : ""} ${isLast ? "highlight-last" : ""}`}
                    >
                      <td>{row.i}</td>
                      <td>{row.xi_1}</td>
                      <td>{row.operacion}</td>
                      <td>{row.xi}</td>
                      <td>{row.ri}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "#777" }}>
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <hr className="section-separator" />

      <div className="teoria-container">
        <h2> 📝 Pasos para calcular el método multiplicativo</h2>
        <ol>
            <li>Elegir la semilla inicial <strong>X₀</strong> (mayor que 0).</li>
            <li>Calcular <strong>g = log(P) / log(2)</strong> con P = cantidad de números a generar.</li>
            <li>Calcular la constante multiplicativa <strong>a = 3 + 8k</strong>.</li>
            <li>Definir el módulo <strong>m = 2^g</strong>.</li>
            <li>Aplicar la fórmula:  
            <code>Xᵢ = (a * Xᵢ₋₁) mod m</code>
            </li>
            <li>Calcular el número aleatorio normalizado:  
            <code>rᵢ = Xᵢ / (m - 1)</code>
            </li>
        </ol>

        <h3> ℹ️ Teoría</h3>
        <p>
            El método multiplicativo genera números pseudoaleatorios sin constante aditiva.
            Su semilla debe ser distinta de 0, y la elección de a y m determina la longitud del ciclo.
            Una buena elección garantiza ciclos largos y una distribución uniforme en [0,1).
        </p>
      </div>
    </>
  );
};

export default MetodoMultiplicativo;
