"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FaMotorcycle, FaLock, FaEnvelope } from "react-icons/fa";
import { signIn } from "next-auth/react";

const ROLE_HOME: Record<string, string> = {
  admin:     "/admin",
  sales:     "/admin/quotes",
  warehouse: "/admin/orders",
  customer:  "/",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email:    email.trim().toLowerCase(),
        password: password,
        redirect: false,
      });

      if (!result) {
        setError("Erreur réseau. Veuillez réessayer.");
        return;
      }

      if (result.error) {
        setError("Email ou mot de passe incorrect, ou compte désactivé.");
        return;
      }

      // Connexion réussie — récupérer la session pour connaître le rôle
      const res  = await fetch("/api/auth/session", { cache: "no-store" });
      const sess = await res.json();
      const role: string = sess?.user?.role || "customer";

      // Rafraîchir le router serveur puis rediriger
      router.refresh();
      router.push(ROLE_HOME[role] ?? "/");

    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={7} lg={5}>

            {/* Logo */}
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: 72, height: 72, background: "var(--primary, #e63946)" }}
              >
                <FaMotorcycle size={34} color="#fff" />
              </div>
              <h2 className="text-white fw-bold mb-1">MotoBoutic</h2>
              <p className="text-white-50 small">Espace de gestion</p>
            </div>

            <Card className="border-0 shadow-lg rounded-4">
              <Card.Body className="p-4 p-md-5">

                <h5 className="fw-bold mb-4 text-center">Connexion</h5>

                {error && (
                  <Alert variant="danger" className="d-flex align-items-center gap-2 py-2">
                    <FaLock size={14} className="flex-shrink-0" />
                    <span className="small">{error}</span>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Adresse email</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaEnvelope className="text-muted" size={14} />
                      </span>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        autoComplete="email"
                        className="border-start-0 ps-0"
                        disabled={loading}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="small fw-semibold">Mot de passe</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <FaLock className="text-muted" size={14} />
                      </span>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="border-start-0 ps-0"
                        disabled={loading}
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-100 fw-semibold"
                    style={{ background: "var(--primary, #e63946)", border: "none" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <><Spinner size="sm" className="me-2" />Connexion...</>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </Form>

              </Card.Body>
            </Card>

            <p className="text-center text-white-50 small mt-3">
              © {new Date().getFullYear()} MotoBoutic — Tous droits réservés
            </p>

          </Col>
        </Row>
      </Container>
    </div>
  );
}
