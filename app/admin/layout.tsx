import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "./AdminSidebar";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ── Vérification côté serveur — fiable, sans cookie/env issues ─────────────
  const session = await getServerSession(authOptions);

  // Non connecté → login
  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  // Client → accueil public
  if (!role || role === "customer") {
    redirect("/");
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={2} className="d-none d-lg-block">
          <AdminSidebar
            firstName={session.user.firstName}
            lastName={session.user.lastName}
            email={session.user.email}
            role={role}
          />
        </Col>
        <Col lg={10}>{children}</Col>
      </Row>
    </Container>
  );
}
