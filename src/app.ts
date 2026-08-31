import express, { type Request, type Response } from "express";

interface TransferenciaBody {
  cuentaOrigen?: unknown;
  cuentaDestino?: unknown;
  monto?: unknown;
}

const app = express();

app.use(express.json());

app.get("/", (_request: Request, response: Response) => {
  response.json({
    service: "Banco Andino BFF",
    status: "running",
  });
});

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({
    status: "ok",
    service: "banco-andino-bff",
  });
});

app.get(
  "/api/saldo/:clienteId",
  (request: Request<{ clienteId: string }>, response: Response) => {
    response.json({
      clienteId: request.params.clienteId,
      moneda: "PEN",
      saldoDisponible: 4850.75,
    });
  },
);

app.get(
  "/api/movimientos/:clienteId",
  (request: Request<{ clienteId: string }>, response: Response) => {
    response.json({
      clienteId: request.params.clienteId,
      moneda: "PEN",
      movimientos: [
        {
          id: "MOV-001",
          fecha: "2026-08-28",
          descripcion: "Compra en supermercado",
          tipo: "DEBITO",
          monto: 126.4,
        },
        {
          id: "MOV-002",
          fecha: "2026-08-29",
          descripcion: "Abono de planilla",
          tipo: "CREDITO",
          monto: 3200,
        },
        {
          id: "MOV-003",
          fecha: "2026-08-30",
          descripcion: "Pago de servicio móvil",
          tipo: "DEBITO",
          monto: 59.9,
        },
      ],
    });
  },
);

app.post(
  "/api/transferencias",
  (request: Request<Record<string, never>, unknown, TransferenciaBody>, response: Response) => {
    const { cuentaOrigen, cuentaDestino, monto } = request.body;

    const cuentasInvalidas =
      typeof cuentaOrigen !== "string" ||
      cuentaOrigen.trim().length === 0 ||
      typeof cuentaDestino !== "string" ||
      cuentaDestino.trim().length === 0;
    const montoInvalido = typeof monto !== "number" || !Number.isFinite(monto) || monto <= 0;

    if (cuentasInvalidas || montoInvalido) {
      response.status(400).json({
        status: "INVALID_REQUEST",
        message: "cuentaOrigen, cuentaDestino y un monto mayor que cero son obligatorios",
      });
      return;
    }

    response.status(201).json({
      transactionId: `SIM-${Date.now()}`,
      status: "SIMULATED",
      cuentaOrigen: cuentaOrigen.trim(),
      cuentaDestino: cuentaDestino.trim(),
      monto,
      moneda: "PEN",
      message: "Transferencia simulada; no se ejecutó ninguna operación bancaria real",
    });
  },
);

export { app };
export default app;
