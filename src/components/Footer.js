import "../stylesheets/Footer.css";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer>
      <p>
        by Charly BGood
        <a
          href="https://github.com/CharlyBGood/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
      </p>
    </footer>
  );
}

export default Footer;
