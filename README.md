# Banco Andino BFF

Backend for Frontend (BFF) demostrativo para la aplicación de banca móvil del caso académico **Banco Andino**.

## Contexto y propósito

Este servicio ofrece una API pequeña y específica para un cliente móvil. Su objetivo es demostrar una base profesional para un flujo de integración continua con GitHub Actions y contenerización con Docker. Una etapa académica posterior podrá incorporar Azure Container Registry y Azure Container Apps; este repositorio todavía no realiza despliegues a Azure.

El proyecto no se conecta a sistemas bancarios, no persiste datos y no implementa autenticación. Toda la información financiera y cada transacción son simuladas exclusivamente con fines académicos.

## Tecnologías

- Node.js
- TypeScript en modo estricto
- Express
- Jest, ts-jest y Supertest
- Docker
- GitHub Actions

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Devuelve el nombre y estado básico del servicio. |
| `GET` | `/health` | Comprueba que el BFF está disponible. |
| `GET` | `/api/saldo/:clienteId` | Devuelve un saldo ficticio en PEN. |
| `GET` | `/api/movimientos/:clienteId` | Devuelve movimientos ficticios del cliente. |
| `POST` | `/api/transferencias` | Valida y registra una transferencia simulada. |

La solicitud de transferencia debe enviar JSON con `cuentaOrigen`, `cuentaDestino` y un `monto` mayor que cero:

```json
{
  "cuentaOrigen": "001-123456",
  "cuentaDestino": "001-654321",
  "monto": 250.5
}
```

Una solicitud válida responde con HTTP `201` y estado `SIMULATED`. Una solicitud incompleta o con un monto inválido responde con HTTP `400`.

## Instalación y ejecución local

Requisitos: Node.js 22 o posterior y npm.

```bash
npm ci
npm run build
npm test
npm start
```

El servicio escucha de forma predeterminada en `http://localhost:3000`. La variable de entorno `PORT` permite seleccionar otro puerto.

## Ejecución con Docker

Construir la imagen:

```bash
docker build -t banco-andino-bff:v1 .
```

Ejecutar el contenedor:

```bash
docker run --rm -p 3000:3000 banco-andino-bff:v1
```

## Integración continua

El workflow `CI - Banco Andino BFF` se ejecuta en cada `push` a `main` y en cada `pull_request` dirigido a `main`. El job instala las dependencias mediante `npm ci`, compila TypeScript, ejecuta las pruebas, audita las dependencias de producción en busca de vulnerabilidades de nivel alto y valida que la imagen Docker pueda construirse.

La automatización actual cubre únicamente CI, pruebas y Docker. No contiene credenciales, conexiones bancarias reales ni pasos de despliegue a Azure.

## Aviso académico

Los clientes, saldos, movimientos, cuentas y transferencias expuestos por esta API son ficticios. Este software es una demostración académica y no debe utilizarse para procesar operaciones financieras reales.
