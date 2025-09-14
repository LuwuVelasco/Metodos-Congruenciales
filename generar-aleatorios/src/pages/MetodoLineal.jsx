import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Tooltip } from "react-tooltip";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import "./MetodoLineal.css";

const MetodoLineal = () => {
  const [x0, setX0] = useState(0);
  const [k, setK] = useState(0);
  const [c, setC] = useState(0);
  const [p, setP] = useState(0);
  const [decimales, setDecimales] = useState(2);
  const [tabla, setTabla] = useState([]);
  const [m, setM] = useState(null);
  const [g, setG] = useState(null);
  const [a, setA] = useState(null);

  const campos = [
    { label: "X₀", value: x0, set: setX0, info: "Valor inicial de la serie pseudoaleatoria" },
    { label: "K", value: k, set: setK, info: "Constante multiplicativa del método" },
    { label: "C", value: c, set: setC, info: "Constante aditiva del método" },
    { label: "P", value: p, set: setP, info: "Cantidad de números a generar" },
    { label: "Decimales", value: decimales, set: setDecimales, info: "Cantidad de decimales de rᵢ" },
  ];

  const mcd = (a, b) => (b === 0 ? a : mcd(b, a % b));

  const calcularLineal = () => {
    if (p <= 0) {
      Swal.fire("Error", "Debes ingresar un valor P > 0", "error");
      return;
    }

    if (!Number.isInteger(k)) {
      Swal.fire("Error", "K debe ser un número entero", "error");
      return;
    }

    let g = Math.ceil(Math.log(p) / Math.log(2));
    let a = 1 + 4 * k;
    let m = Math.pow(2, g);

    if (a % 2 === 0) {
      Swal.fire("Error", "a debe ser impar (1 + 4k)", "error");
      return;
    }

    if (c <= 0 || mcd(c, m) !== 1) {
      Swal.fire(
        "Error",
        `C debe ser > 0 y relativamente primo con m = ${m}`,
        "error"
      );
      return;
    }

    setG(g);
    setA(a);
    setM(m);

    let tempTabla = [];
    let xi = x0;

    for (let i = 1; i <= p + 1; i++) {
      let op = `(${a} * ${xi} + ${c}) MOD ${m}`;
      let xiNext = (a * xi + c) % m;
      let ri = +(xiNext / (m - 1)).toFixed(decimales);
      tempTabla.push({ i, xi_1: xi, operacion: op, xi: xiNext, ri });
      xi = xiNext;
    }

    setTabla(tempTabla);
  };

  const limpiar = () => {
    setTabla([]);
    setX0(0);
    setP(0);
    setC(0);
    setK(0);
    setDecimales(2);
    setM(null);
    setG(null);
    setA(null);
  };

  const exportarExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SerieLineal");
    worksheet.columns = [
      { header: "i", key: "i", width: 10 },
      { header: "Xᵢ₋₁", key: "xi_1", width: 15 },
      { header: "Operación", key: "operacion", width: 25 },
      { header: "Xᵢ", key: "xi", width: 15 },
      { header: "rᵢ", key: "ri", width: 15 },
    ];
    tabla.forEach((row) => worksheet.addRow(row));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "serie_lineal.xlsx");
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
            <button className="button-blue" onClick={calcularLineal}>GENERAR</button>
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
        <h2> 📝 Pasos para calcular el método lineal congruencial</h2>
        <ol>
            <li>Elegir la semilla inicial <strong>X₀</strong>.</li>
            <li>Calcular <strong>g = log(P) / log(2) </strong> con P = cantidad de números a generar.</li>
            {/*<li>Definir <strong>k = g</strong>.</li>*/}
            <li>Calcular la constante multiplicativa <strong>a = 1 + 4k</strong>.</li>
            <li>Definir el módulo <strong>m = 2^g</strong>.</li>
            {/*<li>Hallar <strong>c</strong>, un número primo relativo cercano a m.</li>*/}
            <li>Aplicar la fórmula:  
            <code>Xᵢ = (a * Xᵢ₋₁ + c) mod m</code>
            </li>
            <li>Calcular el número aleatorio normalizado:  
            <code>rᵢ = Xᵢ / (m - 1)</code>
            </li>
        </ol>

        <h3> ℹ️ Teoría</h3>
        <p>
            El método lineal congruencial es uno de los algoritmos más usados para generar
            números pseudoaleatorios. Su calidad depende de la correcta elección de los
            parámetros <strong>a</strong>, <strong>c</strong>, <strong>m</strong> y de la semilla <strong>X₀</strong>.  
            Una buena elección garantiza ciclos largos y una distribución uniforme en [0,1).
        </p>
        </div>
    </>
  );
};

export default MetodoLineal;
