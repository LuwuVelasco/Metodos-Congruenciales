import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>Métodos Congruenciales</h1>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Inicio</Link>
        <Link to="/lineal" style={styles.link}>Lineal</Link>
        <Link to="/multiplicativo" style={styles.link}>Multiplicativo</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "rgba(0,0,0,0.7)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  title: { color: "white", fontSize: "1.5rem" },
  links: { display: "flex", gap: "1rem" },
  link: { color: "cyan", textDecoration: "none", fontWeight: "bold" }
};

export default Navbar;
