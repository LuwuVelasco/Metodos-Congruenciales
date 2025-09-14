import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { ParallaxProvider, ParallaxBanner } from "react-scroll-parallax";
import { Link } from "react-router-dom";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  const scrollToMethods = () => {
    const element = document.getElementById("methods-section");
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home">
      <ParallaxProvider>
        <ParallaxBanner
            layers={[{ image: "https://www.freecodecamp.org/espanol/news/content/images/2023/04/5f9c9819740569d1a4ca1826.jpeg", speed: -20 }]}
            className="hero"
        >
            <div className="hero-content" data-aos="fade-in">
                <h1 className="hero-text" data-aos="fade-down">MÉTODOS</h1>
                <h1 className="hero-text" data-aos="fade-down">CONGRUENCIALES</h1>
                <p className="hero-subtext" data-aos="fade-down">Generación de secuencias de números pseudoaleatorios mediante algoritmos</p>

                <div className="scroll-down" onClick={scrollToMethods}>
                  &#x25BC;
                </div>
            </div>
        </ParallaxBanner>
      </ParallaxProvider>

      <section className="intro" data-aos="fade-up" style={{ textAlign: "center", paddingTop: "2rem" }}>
        <h1>GENERAR SECUENCIA CON: </h1>
      </section>

      <section className="methods" id="methods-section">
        <motion.div className="card" data-aos="fade-up" whileHover={{ scale: 1.05 }}>
          <Link to="/lineal" className="btn">
            <h2>MÉTODO LINEAL</h2>
            <p>
              Generador congruencial lineal: <br />
              Xₙ₊₁ = (aXₙ + c) mod m
              <br /><br />
              Es el método más común para generar números pseudoaleatorios. Fácil de implementar y con buen período si los parámetros son correctos.
            </p>
          </Link>
        </motion.div>

        <motion.div className="card" data-aos="fade-up" whileHover={{ scale: 1.05 }}>
          <Link to="/multiplicativo" className="btn">
            <h2>MÉTODO MULTIPLICATIVO</h2>
            <p>
              Generador congruencial multiplicativo: <br />
              Xₙ₊₁ = (aXₙ) mod m
              <br /><br />
              Caso especial del lineal (c=0). Simplicidad matemática y secuencias con menos patrones repetitivos. La semilla no puede ser 0.
            </p>
          </Link>
        </motion.div>
      </section>

      <footer>
        <p>Creado por: <strong>Luciana Velasco Ponce</strong> | Modelado, Dinámica de Sistemas y Simulación</p>
      </footer>
    </div>
  );
};

export default Home;