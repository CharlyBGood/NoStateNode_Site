import "../stylesheets/Footer.css";
import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer>
      <p>
        by
        <a
          href="https://charlybgood.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="smedia-contact"
        >
          Charly BGood
        </a>
        <a
          href="https://github.com/CharlyBGood/"
          target="_blank"
          rel="noopener noreferrer"
          className="smedia-contact"
        ><FaGithub />
        </a>
      </p>
    </footer>
  );
}
