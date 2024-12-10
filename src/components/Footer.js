import "../stylesheets/Footer.css";
import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer>
      <p>
        by
        <a
          href="https://github.com/CharlyBGood/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Charly BGood
          <FaGithub />
        </a>
      </p>
    </footer>
  );
}
