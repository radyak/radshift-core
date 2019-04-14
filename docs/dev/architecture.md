# Architecture

The Main Platform clusters the core functionality of a _RadShift_ server. It is separated into the components

- Core
- Persistence

<!--
Example mermaid sequence diagram

see https://mermaidjs.github.io/sequenceDiagram.html

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant AppBackend
    participant AuthBackend

    User->>Client: action
    Client->>AppBackend: BackendCall (not authenticated)
    activate AppBackend
    AppBackend->>AppBackend: Check Authentication
    AppBackend->>Client: Response: not authenticated
    deactivate AppBackend
    Client->>User: Display login form

    Note over A,J: A typical interaction
    J->>A: Great!
    deactivate J
```
-->

## Component _Core_

The main roles it serves as are:

- Network Entrypoint:
  - registering IP at DNS
  - establishing and terminating HTTPS
- API Gateway:
  - routing
  - authN/authZ
  - ...
- Administration platform for
  - installed app containers
  - main configuration
  - ...

## Component _Persistence_

To be done ...

## Required manual setup steps

- Domain Provider: Create a (sub)domain and enable DynDNS for it
- Router: Forward ports 80 and 443 to the _RadShift_ server
- _RadShift_: see [Host-Setup](./host/README.md)
