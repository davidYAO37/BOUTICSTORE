"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Container,
  Navbar,
  Nav,
  Form,
  Button,
  Badge,
  Dropdown,
  Offcanvas,
  InputGroup,
} from "react-bootstrap";
import {
  FaWhatsapp,
  FaPhone,
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaMotorcycle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { NAV_LINKS, CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useLocale } from "@/hooks/useLocale";
import { useFavorites } from "@/hooks/useFavorites";

export default function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, t, setLocale } = useLocale();
  const { totalItems } = useCart();
  const { count: favoritesCount } = useFavorites();

  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/catalog/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <header>
      <div className="top-bar py-2" style={{ backgroundColor: "var(--dark)", color: "var(--light)" }}>
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div className="d-flex align-items-center gap-3 small">
              <span className="d-flex align-items-center gap-1">
                <FaPhone size={12} />
                <a href={`tel:${CONTACT.phone}`} className="text-light">
                  {CONTACT.phone}
                </a>
              </span>
              <span className="d-none d-md-flex align-items-center gap-1">
                <FaWhatsapp size={12} />
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                >
                  WhatsApp
                </a>
              </span>
              <span className="d-none d-lg-inline">{CONTACT.hours}</span>
            </div>
            <div className="d-flex align-items-center gap-3 small">
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  className="text-light p-0 text-decoration-none d-flex align-items-center gap-1"
                  style={{ fontSize: "0.875rem" }}
                >
                  {locale.toUpperCase()} <FaChevronDown size={10} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setLocale("fr")} active={locale === "fr"}>
                    Français
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setLocale("en")} active={locale === "en"}>
                    English
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </div>

      <Navbar
        expand="lg"
        className={cn(
          "main-navbar py-2",
          isScrolled && "shadow-sm sticky-top"
        )}
        style={{ backgroundColor: "var(--body-bg)", transition: "all 0.3s ease" }}
      >
        <Container>
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold" style={{ color: "var(--body-color)" }}>
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: 40,
                height: 40,
                backgroundColor: "var(--primary)",
                color: "var(--dark)",
              }}
            >
              <FaMotorcycle size={22} />
            </div>
            <span className="d-none d-sm-inline fs-4">Ivoire Motos</span>
          </Link>

          <div className="d-flex align-items-center gap-2 d-lg-none">
            <Button
              variant="link"
              className="p-2 position-relative"
              style={{ color: "var(--body-color)" }}
              onClick={() => setShowSearch(!showSearch)}
              aria-label={t("search")}
            >
              <FaSearch size={20} />
            </Button>
            <Link href="/cart/" className="btn btn-link p-2 position-relative" style={{ color: "var(--body-color)" }} aria-label={t("cart")}>
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <Badge
                  pill
                  bg="warning"
                  text="dark"
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {totalItems}
                </Badge>
              )}
            </Link>
            <Button
              variant="link"
              className="p-2"
              style={{ color: "var(--body-color)" }}
              onClick={() => setShowMobileMenu(true)}
              aria-label={t("menu")}
            >
              <FaBars size={22} />
            </Button>
          </div>

          <Navbar.Collapse id="main-nav" className="d-none d-lg-flex">
            <Nav className="mx-auto gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href + (link.query?.type || "")}
                  href={link.query ? { pathname: link.href, query: link.query } : link.href}
                  className={cn(
                    "nav-link px-3 rounded",
                    isActive(link.href) && "active"
                  )}
                  style={isActive(link.href) ? { color: "var(--primary-dark)" } : {}}
                >
                  {link.label[locale as keyof typeof link.label]}
                </Link>
              ))}
            </Nav>

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="link"
                className="p-2"
                style={{ color: "var(--body-color)" }}
                onClick={() => setShowSearch(!showSearch)}
                aria-label={t("search")}
              >
                <FaSearch size={20} />
              </Button>

              <Link href="/favorites/" className="btn btn-link p-2 position-relative" style={{ color: "var(--body-color)" }} aria-label={t("favorites")}>
                <FaHeart size={20} />
                {favoritesCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {favoritesCount}
                  </Badge>
                )}
              </Link>

              <Link href="/cart/" className="btn btn-link p-2 position-relative" style={{ color: "var(--body-color)" }} aria-label={t("cart")}>
                <FaShoppingCart size={20} />
                {totalItems > 0 && (
                  <Badge
                    pill
                    bg="warning"
                    text="dark"
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Link>

              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-2 d-flex align-items-center gap-1"
                  style={{ color: "var(--body-color)" }}
                >
                  <FaUser size={20} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} href="/account/">
                    {t("myAccount")}
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} href="/admin/">
                    {t("admin")}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item as={Link} href="/login/">
                    {t("login")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button
                variant="link"
                className="p-2"
                style={{ color: "var(--body-color)" }}
                onClick={toggleTheme}
                aria-label={theme === "light" ? t("darkMode") : t("lightMode")}
              >
                {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
              </Button>
             
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            style={{ backgroundColor: "var(--gray-100)", borderBottom: "1px solid var(--border-color)" }}
          >
            <Container className="py-3">
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="border-0 shadow-sm"
                    style={{ backgroundColor: "var(--body-bg)", color: "var(--body-color)" }}
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch />
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowSearch(false)}
                    aria-label={t("close")}
                  >
                    <FaTimes />
                  </Button>
                </InputGroup>
              </Form>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="d-lg-none"
        style={{ backgroundColor: "var(--body-bg)" }}
      >
        <Offcanvas.Header closeButton className="border-bottom" style={{ borderColor: "var(--border-color)" }}>
          <Offcanvas.Title className="d-flex align-items-center gap-2 fw-bold">
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{ width: 36, height: 36, backgroundColor: "var(--primary)", color: "var(--dark)" }}
            >
              <FaMotorcycle size={18} />
            </div>
            Ivoire Motos
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + (link.query?.type || "")}
                href={link.query ? { pathname: link.href, query: link.query } : link.href}
                className={cn(
                  "nav-link px-3 py-2 rounded",
                  isActive(link.href) && "active"
                )}
                onClick={() => setShowMobileMenu(false)}
                style={isActive(link.href) ? { backgroundColor: "var(--primary-light)", color: "var(--dark)" } : {}}
              >
                {link.label[locale as keyof typeof link.label]}
              </Link>
            ))}
          </Nav>

          <hr style={{ borderColor: "var(--border-color)" }} />

          <div className="d-flex flex-column gap-2">
            <Link href="/favorites/" className="btn btn-outline-secondary d-flex align-items-center gap-2 justify-content-start" onClick={() => setShowMobileMenu(false)}>
              <FaHeart /> {t("favorites")}
              {favoritesCount > 0 && <Badge bg="danger" pill>{favoritesCount}</Badge>}
            </Link>
            <Link href="/cart/" className="btn btn-outline-secondary d-flex align-items-center gap-2 justify-content-start" onClick={() => setShowMobileMenu(false)}>
              <FaShoppingCart /> {t("cart")}
              {totalItems > 0 && <Badge bg="warning" text="dark" pill>{totalItems}</Badge>}
            </Link>
            <Link href="/account/" className="btn btn-outline-secondary d-flex align-items-center gap-2 justify-content-start" onClick={() => setShowMobileMenu(false)}>
              <FaUser /> {t("myAccount")}
            </Link>
            <Button
              variant="outline-secondary"
              className="d-flex align-items-center gap-2 justify-content-start"
              onClick={() => {
                toggleTheme();
                setShowMobileMenu(false);
              }}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
              {theme === "light" ? t("darkMode") : t("lightMode")}
            </Button>
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success d-flex align-items-center gap-2"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a href={`tel:${CONTACT.phone}`} className="btn btn-primary d-flex align-items-center gap-2">
              <FaPhone /> {t("call")}
            </a>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </header>
  );
}
