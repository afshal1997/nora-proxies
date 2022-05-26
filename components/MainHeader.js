import React from "react";
import { useAuth } from "@contexts/AuthContext";
import Link from "next/link";
import { Navbar, Container, Nav } from "react-bootstrap";

const MainHeader = () => {
  const { currentUser, authenticated, randomString } = useAuth();

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="transparent" fixed="top" variant="transparent">
        <Container>
          <Navbar.Brand href="/">
            <img src='/imgs/logo/logo.png' className="w-100 nora-logo" alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="m-auto">
              <Nav.Link className="text-light mx-3" href="/">Home</Nav.Link>
              <Nav.Link className="text-light mx-3" href="#aboutUs">About Us</Nav.Link>
              <Nav.Link className="text-light mx-3" href="#features">Features</Nav.Link>
              <Nav.Link className="text-light mx-3" href="/">Proxies</Nav.Link>
              <Nav.Link className="text-light mx-3" href="#Mails">Mails</Nav.Link>
            </Nav>
            <Nav>
              <span className="d-flex">
                {authenticated ? (
                  <Link href="/dashboard" passHref>
                    <a href="" className="rounded-pill btn btnLogin btn-lg px-4">
                      Dashboard
                    </a>
                  </Link>
                ) : (
                  <a className="rounded-pill btn btnLogin btn-lg px-4" href={`${process.env.NEXT_PUBLIC_DISCORD_URL}&state=${encodeURIComponent(randomString)}`}>
                    Proxy Dashboard
                  </a>
                )}
              </span>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MainHeader;
