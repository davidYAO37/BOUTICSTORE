"use client";

import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaMap } from "react-icons/fa";
import { CONTACT, GOOGLE_MAPS_URL } from "@/lib/constants";

export default function ContactContent() {
  return (
    <Container className="py-5">
      <h1 className="section-title text-center mb-4">Contactez-nous</h1>
      <p className="text-center text-muted mb-5">
        Notre équipe est à votre disposition pour vous accompagner dans votre projet moto.
      </p>
      <Row className="g-4">
        <Col lg={5}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h4 className="mb-4">Informations de contact</h4>
              <div className="d-flex flex-column">
                <div className="border-bottom py-3 d-flex align-items-center gap-3">
                  <div className="text-primary"><FaPhone /></div>
                  <div>{CONTACT.phone}</div>
                </div>
                <div className="border-bottom py-3 d-flex align-items-center gap-3">
                  <div className="text-success"><FaWhatsapp /></div>
                  <div>{CONTACT.whatsapp}</div>
                </div>
                <div className="border-bottom py-3 d-flex align-items-center gap-3">
                  <div className="text-primary"><FaEnvelope /></div>
                  <div>{CONTACT.email}</div>
                </div>
                <div className="border-bottom py-3 d-flex align-items-center gap-3">
                  <div className="text-danger"><FaMapMarkerAlt /></div>
                  <div>{CONTACT.address}</div>
                </div>
                <div className="py-3 d-flex align-items-center gap-3">
                  <div className="text-warning"><FaClock /></div>
                  <div>Lun - Sam : 08h00 - 18h00</div>
                </div>
              </div>
              <Button
                variant="outline-primary"
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-100 d-flex align-items-center justify-content-center gap-2 mt-3"
              >
                <FaMap /> Voir sur Google Maps
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h4 className="mb-4">Envoyez-nous un message</h4>
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nom</Form.Label>
                      <Form.Control required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Téléphone</Form.Label>
                      <Form.Control />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Sujet</Form.Label>
                      <Form.Select>
                        <option>Demande d&apos;information</option>
                        <option>Devis</option>
                        <option>Essai</option>
                        <option>SAV</option>
                        <option>Autre</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Message</Form.Label>
                      <Form.Control as="textarea" rows={5} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" size="lg" className="mt-3">
                  Envoyer
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
