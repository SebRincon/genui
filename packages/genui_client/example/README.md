# GenUI Client Example

This example demonstrates how to use the `genui_client` package to build a chat application that communicates with a `genui_server` instance.

## Getting Started

### 1. Run the Server

Before running this client application, you must have a `genui_server` instance running.

1.  Navigate to the server package:
    ```bash
    cd packages/genui_server
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Run the server:
    ```bash
    pnpm run genkit:dev
    ```

The server will start on `http://localhost:3405`.

### 2. Run the Client

Once the server is running, you can run the Flutter client application.

1.  Navigate to this example's directory:
    ```bash
    cd packages/genui_client/example
    ```
2.  Get dependencies:
    ```bash
    flutter pub get
    ```
3.  Run the app:
    ```bash
    flutter run
    ```