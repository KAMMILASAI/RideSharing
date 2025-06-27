import React from 'react';
import { FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="footer-socials">
      <a href="https://linkedin.com/in/SaiKammila" target="_blank" rel="noopener noreferrer" title="LinkedIn">
        <FaLinkedin />
      </a>
      <a href="https://github.com/KAMMILASAI" target="_blank" rel="noopener noreferrer" title="GitHub">
        <FaGithub />
      </a>
      <a href="https://wa.me/918179077852" target="_blank" rel="noopener noreferrer" title="WhatsApp">
        <FaWhatsapp />
      </a>
      <a href="mailto:saikammila143@gmail.com" title="Email">
        <FaEnvelope />
      </a>
    </div>
    <div className="footer-info">
      <span>@2025 Sai Kammila</span> &nbsp;|&nbsp; <span>Version 1.0.0</span>
    </div>
  </footer>
);

export default Footer;
