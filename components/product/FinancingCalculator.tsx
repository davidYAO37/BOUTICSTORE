"use client";

import React, { useState, useMemo } from "react";
import { Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import { FaCalculator } from "react-icons/fa";
import { useLocale } from "@/hooks/useLocale";
import { formatPrice, calculateFinancing } from "@/lib/utils";
import { FINANCING_OPTIONS } from "@/lib/constants";

interface FinancingCalculatorProps {
  price: number;
}

export default function FinancingCalculator({ price }: FinancingCalculatorProps) {
  const { locale } = useLocale();
  const [plan, setPlan] = useState(FINANCING_OPTIONS[1]);
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.3));

  const result = useMemo(() => {
    return calculateFinancing(price, plan.months, Math.round((downPayment / price) * 100), plan.interestRate);
  }, [price, plan, downPayment]);

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <FaCalculator className="text-primary" />
          <h5 className="mb-0">
            {locale === "fr" ? "Calculateur de financement" : "Financing calculator"}
          </h5>
        </div>

        <div className="d-flex gap-2 mb-3">
          <Button
            variant={plan.months === 0 ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => setPlan({ months: 0, downPaymentPercent: 0, interestRate: 0 })}
          >
            {locale === "fr" ? "Comptant" : "Cash"}
          </Button>
          {FINANCING_OPTIONS.map((option) => (
            <Button
              key={option.months}
              variant={plan.months === option.months ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => {
                setPlan(option);
                setDownPayment(Math.round(price * (option.downPaymentPercent / 100)));
              }}
            >
              {option.months} {locale === "fr" ? "mois" : "months"}
            </Button>
          ))}
        </div>

        {plan.months > 0 && (
          <Form.Group className="mb-3">
            <Form.Label>
              {locale === "fr" ? "Apport" : "Down payment"} : {formatPrice(downPayment)}
            </Form.Label>
            <Form.Range
              min={0}
              max={Math.round(price * 0.7)}
              step={10000}
              value={downPayment}
              onChange={(e) => setDownPayment(parseInt(e.target.value, 10))}
            />
          </Form.Group>
        )}

        <Row className="g-2">
          <Col xs={6}>
            <div className="p-2 rounded bg-light">
              <small className="text-muted d-block">{locale === "fr" ? "Apport" : "Down payment"}</small>
              <strong>{formatPrice(result.downPayment)}</strong>
            </div>
          </Col>
          <Col xs={6}>
            <div className="p-2 rounded bg-light">
              <small className="text-muted d-block">{locale === "fr" ? "Mensualité" : "Monthly"}</small>
              <strong>{formatPrice(result.monthlyPayment)}</strong>
            </div>
          </Col>
          <Col xs={6}>
            <div className="p-2 rounded bg-light">
              <small className="text-muted d-block">{locale === "fr" ? "Total" : "Total"}</small>
              <strong>{formatPrice(result.total)}</strong>
            </div>
          </Col>
          <Col xs={6}>
            <div className="p-2 rounded bg-light">
              <small className="text-muted d-block">{locale === "fr" ? "Taux" : "Rate"}</small>
              <strong>{result.interestRate}%</strong>
            </div>
          </Col>
        </Row>

        <div className="mt-3 text-center">
          <Badge bg="info" className="p-2">
            {locale === "fr" ? "Simulation non contractuelle" : "Non-binding simulation"}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
}
