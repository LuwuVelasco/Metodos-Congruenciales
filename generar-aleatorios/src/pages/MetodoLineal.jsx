import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Tooltip } from "react-tooltip";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./MetodoLineal.css";

const MetodoLineal = () => {
  const [x0, setX0] = useState(0);
  const [p, setP] = useState(0);
  const [decimales, setDecimales] = useState(2);
  const [tabla, setTabla] = useState([]);

  const [g, setG] = useState(null);
  const [k, setK] = useState(null);
  const [a, setA] = useState(null);
  const [m, setM] = useState(null);
  const [c, setC] = useState(null);

  const campos = [
    { label: "X₀", value: x0, set: setX0, info: "Valor inicial de la serie pseudoaleatoria / Semilla" },
    { label: "P", value: p, set: setP, info: "Cantidad de números a generar" },
    { label: "Decimales", value: decimales, set: setDecimales, info: "Cantidad de decimales de rᵢ" },
  ];

  const calcularLineal = () => {
    let g = Math.log(p) / Math.log(2);
    let k = g;
    let a = 1 + 4 * k;
    let m = Math.pow(2, g);
    let c = hallarPrimoRelativo(m);
    let tempTabla = [];
    let xi = x0;

    setG(g);
    setK(k);
    setA(a);
    setM(m);
    setC(c);

    for (let i = 1; i <= p + 1; i++) {
      let op = `(${a} * ${xi} + ${c}) MOD ${m}`;
      let xiNext = (a * xi + c) % m;
      let ri = +(xiNext / (m-1)).toFixed(decimales);
      tempTabla.push({ i, xi_1: xi, operacion: op, xi: xiNext, ri });
      xi = xiNext;
    }

    setTabla(tempTabla);
  };

  const esPrimo = (num) => {
    if (num < 2) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
    return true;
  };

  const hallarPrimoRelativo = (m) => {
    let primoMenor, primoMayor, posicionMenor, posicionMayor;
    for (let i = m - 1; i >= 2; i--) {
      if (esPrimo(i)) {
        primoMenor = i;
        posicionMenor = m - i;
        break;
      }
    }
    for (let i = m + 1; ; i++) {
      if (esPrimo(i)) {
        primoMayor = i;
        posicionMayor = i - m;
        break;
      }
    }
    return posicionMenor <= posicionMayor ? primoMenor : primoMayor;
  }

  const limpiar = () => {
    setTabla([]);
    setX0(0);
    setP(0);
    setDecimales(2);

    setG(null);
    setK(null);
    setA(null);
    setM(null);
    setC(null);
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
                {/*Tooltip aparece encima de la tabla*/}
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
                <strong>g =</strong> {g !== null ? g.toFixed(2) : "-"}
            </div>

            <div className="Calculo-info-item">
                <span data-tooltip-id="tooltip-k">🛈</span>
                <Tooltip id="tooltip-k" place="right" effect="solid">
                k = Se usa para definir el multiplicador a.
                </Tooltip>
                <strong>k =</strong> {k !== null ? k.toFixed(2) : "-"}
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

            <div className="Calculo-info-item">
                <span data-tooltip-id="tooltip-c">🛈</span>
                <Tooltip id="tooltip-c" place="right" effect="solid">
                c = Constante aditiva.
                </Tooltip>
                <strong>c =</strong> {c !== null ? c : "-"}
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
            <li>Definir <strong>k = g</strong>.</li>
            <li>Calcular la constante multiplicativa <strong>a = 1 + 4k</strong>.</li>
            <li>Definir el módulo <strong>m = 2^g</strong>.</li>
            <li>Hallar <strong>c</strong>, un número primo relativo cercano a m.</li>
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
