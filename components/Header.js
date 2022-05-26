import React from "react";
import MainHeader from "@components/MainHeader";

const Header = () => {
  return (
    <>
      <MainHeader />
      <section className="home-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 my-lg-5 py-lg-5" data-aos="fade-left">
              <div className="my-lg-5 py-lg-5">
                <h1 className="fw-bold my-lg-4 py-lg-4 nora-text-primary">The Finest Proxies On The Market</h1>
                <button className="rounded-pill btn btnLogin btn-lg px-4" type="submit">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
