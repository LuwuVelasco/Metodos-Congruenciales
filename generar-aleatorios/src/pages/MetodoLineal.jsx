import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Tooltip } from "react-tooltip";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import "./MetodoLineal.css";

const MetodoLineal = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [x0, setX0] = useState(0);
  const [k, setK] = useState(0);
  const [c, setC] = useState(0);
  const [p, setP] = useState(0);
  const [decimales, setDecimales] = useState(2);
  const [tabla, setTabla] = useState([]);

  // parámetros derivados
  const [m, setM] = useState(null);
  const [g, setG] = useState(null);
  const [a, setA] = useState(null);

  const campos = [
    { label: "X₀", value: x0, set: setX0, info: "Semilla inicial (0 ≤ X₀ < m)" },
    { label: "K", value: k, set: setK, info: "K entero ≥ 0 para a = 1 + 4K" },
    { label: "C", value: c, set: setC, info: "C entero > 0 y coprimo con m" },
    { label: "P", value: p, set: setP, info: "Cantidad de números a generar (entero > 0)" },
    { label: "Decimales", value: decimales, set: setDecimales, info: "Cantidad de decimales de rᵢ (0–10)" },
  ];

  const mcd = (x, y) => (y === 0 ? Math.abs(x) : mcd(y, x % y));

  const calcularLineal = () => {
    // ===== VALIDACIONES =====
    if (!Number.isInteger(p) || p <= 0) {
      Swal.fire("Error", "P debe ser un entero > 0", "error"); return;
    }
    if (!Number.isInteger(k) || k < 0) {
      Swal.fire("Error", "K debe ser un entero ≥ 0", "error"); return;
    }
    if (!Number.isInteger(c) || c <= 0) {
      Swal.fire("Error", "C debe ser un entero > 0", "error"); return;
    }
    if (!Number.isInteger(decimales) || decimales < 0 || decimales > 10) {
      Swal.fire("Error", "Decimales debe estar entre 0 y 10", "error"); return;
    }

    // Derivados
    const gLoc = Math.ceil(Math.log(p) / Math.log(2)); // m >= P
    const aLoc = 1 + 4 * k;                             // a ≡ 1 (mod 4)
    const mLoc = Math.pow(2, gLoc);

    if (aLoc % 2 === 0) {
      Swal.fire("Error", "a debe ser impar (usa a = 1 + 4k)", "error"); return;
    }
    if (mcd(c, mLoc) !== 1) {
      Swal.fire("Error", `C debe ser coprimo con m = ${mLoc}`, "error"); return;
    }
    if (x0 < 0 || x0 >= mLoc) {
      Swal.fire("Error", `X₀ debe estar en [0, ${mLoc - 1}]`, "error"); return;
    }

    setG(gLoc); setA(aLoc); setM(mLoc);

    // ===== GENERACIÓN (P+1 filas para mostrar la repetición) =====
    const tempTabla = [];
    let xi = x0;
    let huboCierre = false;

    for (let i = 1; i <= p + 1; i++) {
      const op = `(${aLoc} * ${xi} + ${c}) MOD ${mLoc}`;
      const xiNext = (aLoc * xi + c) % mLoc;
      const ri = +(xiNext / (mLoc - 1)).toFixed(decimales);
      const cierre = (xiNext === x0); // ¿retorna a X0?
      if (cierre) huboCierre = true;
      tempTabla.push({ i, xi_1: xi, operacion: op, xi: xiNext, ri, cierre });
      xi = xiNext;
    }

    setTabla(tempTabla);

    // Aviso (opcional) si P+1 no muestra cierre
    // if (!huboCierre) Swal.fire("Aviso", "La fila P+1 no cierra el ciclo (X_{P+1} ≠ X₀) con estos parámetros.", "info");
  };

  const limpiar = () => {
    setTabla([]);
    setX0(0); setP(0); setC(0); setK(0); setDecimales(2);
    setM(null); setG(null); setA(null);
  };

  const exportarExcel = async () => {
    if (tabla.length === 0) {
      Swal.fire("Atención", "Primero genera la serie para exportar", "info"); return;
    }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("SerieLineal");
    worksheet.columns = [
      { header: "i", key: "i", width: 8 },
      { header: "Xᵢ₋₁", key: "xi_1", width: 12 },
      { header: "Operación", key: "operacion", width: 28 },
      { header: "Xᵢ", key: "xi", width: 12 },
      { header: "rᵢ", key: "ri", width: 12 },
      { header: "cierre", key: "cierre", width: 10 }, // marca de cierre de ciclo
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
                  value={Number.isNaN(campo.value) ? "" : campo.value}
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
                g define el módulo: m = 2^g
              </Tooltip>
              <strong>g =</strong> {g ?? "-"}
            </div>

            <div className="Calculo-info-item">
              <span data-tooltip-id="tooltip-a">🛈</span>
              <Tooltip id="tooltip-a" place="right" effect="solid">
                a = 1 + 4k (a ≡ 1 (mod 4))
              </Tooltip>
              <strong>a =</strong> {a ?? "-"}
            </div>

            <div className="Calculo-info-item">
              <span data-tooltip-id="tooltip-m">🛈</span>
              <Tooltip id="tooltip-m" place="right" effect="solid">
                m = 2^g
              </Tooltip>
              <strong>m =</strong> {m ?? "-"}
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
                      className={`${isFirst ? "highlight-first" : ""} ${isLast ? "highlight-last" : ""} ${row.cierre ? "highlight-cycle" : ""}`}
                      title={row.cierre ? "Cierre de ciclo: Xᵢ = X₀" : undefined}
                    >
                      <td>{row.i}</td>
                      <td>{row.xi_1}</td>
                      <td>{row.operacion}</td>
                      <td>{row.xi}</td>
                      <td>{row.ri}{row.cierre ? " • cierre" : ""}</td>
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
          <li>Elegir la semilla <strong>X₀</strong>.</li>
          <li>Calcular <strong>g = ⌈log₂ P⌉</strong> y definir <strong>m = 2^g</strong>.</li>
          <li>Calcular <strong>a = 1 + 4k</strong> (a ≡ 1 (mod 4)).</li>
          <li>Elegir <strong>C</strong> coprimo con <strong>m</strong>.</li>
          <li>Aplicar <code>Xᵢ = (a · Xᵢ₋₁ + c) mod m</code>.</li>
          <li>Normalizar <code>rᵢ = Xᵢ / (m - 1)</code>.</li>
          <li>Mostrar <strong>P+1</strong> filas para evidenciar el posible <em>cierre de ciclo</em>.</li>
        </ol>

        <h3> ℹ️ Teoría</h3>
        <p>
          En un LCG con <em>m = 2^g</em>, basta con tomar <em>a ≡ 1 (mod 4)</em> y un <em>c</em> coprimo con <em>m</em> para lograr buen período.
          La calidad de la secuencia depende de la correcta elección de <strong>a</strong>, <strong>c</strong>, <strong>m</strong> y <strong>X₀</strong>.
        </p>
      </div>

      <footer>
        <p>Creado por: <strong>Luciana Velasco Ponce</strong> | Modelado, Dinámica de Sistemas y Simulación</p>
      </footer>
    </>
  );
};

export default MetodoLineal;
