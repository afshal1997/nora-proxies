import React, { useEffect, useState } from "react";
import { useAuth } from "@contexts/AuthContext";
import Link from "next/link";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "node_modules/@fortawesome/react-fontawesome/index";
import { faBars } from "node_modules/@fortawesome/free-solid-svg-icons/index";

const MainHeader = () => {
  const { currentUser, authenticated, randomString } = useAuth();
  const [color, setColor] = useState('transparent')
  const [blur, setBlur] = useState('blur(0px)')
  const [transition, settransition] = useState('1s')
  const [height, setheight] = useState('85px')


  const listenScrollEvent = e => {
    if (window.scrollY > 100 && window.innerWidth > 992) {
      setColor("rgb(0, 0, 0, 0.4)")
      settransition("1s")
      setBlur("blur(8px)")
      setheight("65px")
    } else {
      document.getElementById("header-menu").style = null
      setColor("transparent")
      settransition("1s")
      setBlur("blur(0px)")
      setheight("85px")
    }
  }
  useEffect(() => {
    listenScrollEvent()
  }, [])
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent)
  }, [window.location])

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="transparent"
        fixed="top"
        variant="transparent"
        id="header-menu"
        style={{ background: color, backdropFilter: blur, transition: transition }}
      >
        <Container>
          <Navbar.Brand href="/">
            <img src='/imgs/logo/logo.png' className="w-100 nora-logo" alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav">
            <span>
              <FontAwesomeIcon icon={faBars} />
            </span>
          </Navbar.Toggle>
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
