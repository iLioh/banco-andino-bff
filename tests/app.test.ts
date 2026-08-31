/// <reference types="jest" />

import request from "supertest";

import app from "../src/app";

describe("Banco Andino BFF", () => {
  test("GET /health devuelve HTTP 200 y estado ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "banco-andino-bff",
    });
  });

  test("GET /api/saldo/CLI001 devuelve el cliente y la moneda", async () => {
    const response = await request(app).get("/api/saldo/CLI001");

    expect(response.status).toBe(200);
    expect(response.body.clienteId).toBe("CLI001");
    expect(response.body.moneda).toBe("PEN");
    expect(typeof response.body.saldoDisponible).toBe("number");
  });

  test("POST /api/transferencias rechaza un monto negativo", async () => {
    const response = await request(app).post("/api/transferencias").send({
      cuentaOrigen: "001-123456",
      cuentaDestino: "001-654321",
      monto: -50,
    });

    expect(response.status).toBe(400);
  });

  test("POST /api/transferencias crea una simulación válida", async () => {
    const response = await request(app).post("/api/transferencias").send({
      cuentaOrigen: "001-123456",
      cuentaDestino: "001-654321",
      monto: 250.5,
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("SIMULATED");
    expect(response.body.transactionId).toMatch(/^SIM-\d+$/);
  });
});
