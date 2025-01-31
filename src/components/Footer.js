import "../stylesheets/Footer.css";
import { FaGithub } from "react-icons/fa";

export function Footer() {
  return (
    <footer>
      <a
        href='https://ko-fi.com/D1D819H6X6'
        target='_blank'
        rel="noopener noreferrer"
        className="ko-fi-a">
        <img
          height='36'
          className="ko-fi-btn"
          src='https://storage.ko-fi.com/cdn/kofi6.png?v=6'
          border='0'
          alt='Buy Me a Coffee at ko-fi.com' /></a>
      <p>
        _
        <a
          href="https://charlybgood.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="smedia-contact"
        >
          by Charly BGood
        </a>
        _
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
