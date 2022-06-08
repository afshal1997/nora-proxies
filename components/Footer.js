import React from "react";
import { FontAwesomeIcon } from "node_modules/@fortawesome/react-fontawesome/index";
import { faEnvelope } from "node_modules/@fortawesome/free-regular-svg-icons/index";
import { faDiscord, faInstagram, faTwitter } from "node_modules/@fortawesome/free-brands-svg-icons/index";

const Footer = () => {
  return (
    <footer className="footer-bg pt-5">
      <div className="container">
        <div className="row">

          <div className="col-lg-2">

          </div>
          <div className="col-lg-4 mt-0">
            <ul>
              <li>
                <img src="/imgs/logo/logo.png" className="w-100 noora-footer-logo" alt="logo" />
              </li>
              <li className="mt-lg-5 pt-lg-5">
                <FontAwesomeIcon icon={faEnvelope} />
                <a href="mailto:noraproxies@gmail.com" className="text-light text-decoration-none">noraproxies@gmail.com</a>
              </li>
              <li>
                <span className="social-links">
                  <a href="javascript:void(0)">
                    <FontAwesomeIcon className="rounded-pill border border-primary p-2 fab fa-instagram" icon={faInstagram} />
                  </a>
                </span>
                <span className="social-links">
                  <a href="https://twitter.com/SolutionsNora">
                    <FontAwesomeIcon className="rounded-pill border border-primary p-2 fab fa-instagram" icon={faTwitter} />
                  </a>
                </span>
                <span className="social-links">
                  <a href="https://discord.gg/PuzmjXRUYC">
                    <FontAwesomeIcon className="rounded-pill border border-primary p-2 fab fa-instagram" icon={faDiscord} />
                  </a>
                </span>
              </li>
            </ul>

          </div>
          <div className="col-lg-4">
            <h2 className="fw-bold">Connect with Us</h2>
            <div className="row contact-us-form">
              <div className="col-lg-12">
                <input type="text" className="form-control bg-transparent border-0 rounded-0 border-bottom" placeholder="Name" />
              </div>
              <div className="col-lg-12">
                <input type="email" className="form-control bg-transparent border-0 rounded-0 border-bottom" placeholder="Email Address" />
              </div>
              <div className="col-lg-12">
                <input type="tel+" className="form-control bg-transparent border-0 rounded-0 border-bottom" placeholder="Phone" />
              </div>
              <div className="col-lg-12">
                <textarea name="message" placeholder="Message" className="form-control bg-transparent border-0 rounded-0 border-bottom" id=""  ></textarea>
              </div>
              <div className="col-lg-4">
                <button className="rounded-pill btn btnLogin btn-lg px-4">Submit</button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="w-100 py-3 footer-copy-right">
        <p className="col-lg-4 m-auto text-center">Copyright © 2022 All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
