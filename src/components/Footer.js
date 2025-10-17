import "../stylesheets/Footer.css";
import { FaBolt } from "react-icons/fa";

export function Footer() {
  return (
    <footer>
      <p className="text-xs">
        © {new Date().getFullYear()} Creado con ❤️ por
      </p>

      <a
        href="https://sinapsialab.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="gradient-link"
      >
        SinapsiaLab
      </a>
      <FaBolt />
    </footer>
  );
}
