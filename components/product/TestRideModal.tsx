"use client";

import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testRideSchema, TestRideInput } from "@/lib/zod-schemas";
import { useLocale } from "@/hooks/useLocale";
import { createTestRide } from "@/services/api";
import { toast } from "react-toastify";

interface TestRideModalProps {
  show: boolean;
  onHide: () => void;
  motorcycleId: string;
  motorcycleName: string;
}

export default function TestRideModal({ show, onHide, motorcycleId, motorcycleName }: TestRideModalProps) {
  const { locale } = useLocale();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TestRideInput>({
    resolver: zodResolver(testRideSchema),
    defaultValues: {
      motorcycle: motorcycleId,
    },
  });

  const onSubmit = async (data: TestRideInput) => {
    try {
      await createTestRide(data);
      toast.success(locale === "fr" ? "Demande d'essai envoyée !" : "Test ride request sent!");
      reset();
      onHide();
    } catch {
      toast.error(locale === "fr" ? "Erreur lors de l'envoi" : "Error sending request");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{locale === "fr" ? "Prendre rendez-vous pour un essai" : "Book a test ride"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <p className="text-muted">{locale === "fr" ? "Pour" : "For"}: <strong>{motorcycleName}</strong></p>
          <input type="hidden" {...register("motorcycle")} value={motorcycleId} />
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{locale === "fr" ? "Prénom" : "First name"} *</Form.Label>
                <Form.Control {...register("firstName")} isInvalid={!!errors.firstName} />
                <Form.Control.Feedback type="invalid">{errors.firstName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{locale === "fr" ? "Nom" : "Last name"} *</Form.Label>
                <Form.Control {...register("lastName")} isInvalid={!!errors.lastName} />
                <Form.Control.Feedback type="invalid">{errors.lastName?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email *</Form.Label>
                <Form.Control type="email" {...register("email")} isInvalid={!!errors.email} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{locale === "fr" ? "Téléphone" : "Phone"} *</Form.Label>
                <Form.Control {...register("phone")} isInvalid={!!errors.phone} />
                <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{locale === "fr" ? "Date souhaitée" : "Preferred date"} *</Form.Label>
                <Form.Control type="date" {...register("preferredDate")} isInvalid={!!errors.preferredDate} min={new Date().toISOString().split("T")[0]} />
                <Form.Control.Feedback type="invalid">{errors.preferredDate?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{locale === "fr" ? "Heure souhaitée" : "Preferred time"} *</Form.Label>
                <Form.Control type="time" {...register("preferredTime")} isInvalid={!!errors.preferredTime} />
                <Form.Control.Feedback type="invalid">{errors.preferredTime?.message}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>{locale === "fr" ? "Message" : "Message"}</Form.Label>
                <Form.Control as="textarea" rows={3} {...register("message")} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            {locale === "fr" ? "Annuler" : "Cancel"}
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (locale === "fr" ? "Envoi..." : "Sending...") : (locale === "fr" ? "Envoyer" : "Send")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
