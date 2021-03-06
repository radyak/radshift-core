# Open Issues

## App Management

- [x] Develop an own MongoDB ARM32 image
- [ ] Implement app installation, update and uninstallation
- [ ] Develop concept for app stacks
- [ ] Develop an _App management_ (container/stack management)

## Bootstrap

- [x] Use _Context Profiles_
* [ ] Configurize (e.g. JWT: issuer, secrets)
- [ ] Evaluate DNS resonse (badauth, nochg etc.)
- [ ] _Start Docker Swarm_ on machine startup
- [ ] Develop routine for _first startup_ of unconfigured cluster, e.g. separate App on separate port
  - [ ] Set up root user in database
  - [ ] Generate config key on first startup (see also *Security & Configuration*)
  - [ ] Require an validated main configuration before server start
- [ ] _Automatic port forwardings_ on connected router (Problem: Docker uses its own default gateway, not directly the router)

## Project (structure)

- [ ] Use TypeScript
- [ ] Consolidate project for development (debugging) and "production"
  - [x] Live-Reload for Nodemon
- [ ] Refactor core build (frontend & backend)

## Security & Configuration

- [x] User management
- [x] Login
- [x] Secure Admin routes with jwt and roles middleware
- [ ] Develop a concept for AuthN & AuthZ for backends; three basic concepts:
  - [ ] Forward the JWT. Backends can trust it and simply decode it since it has already been verified by authenticationOptional
  - [ ] Forward the user details from the decoded JWT. Might be more unclean but simpler for testing
  - [ ] Let backends specify AuthN & AuthZ requirements in their backendConfig for the core to check them, e.g.:
    ```json
        ...
        "myapp": {
            "securityRules": [
                {
                    "path": "/some/path/**",
                    "authenticated": true,
                    "permissions": [
                        "some",
                        "permissions"
                    ]
                }
            ]
        },
        ...
    ```

- [ ] Develop rock-solid _management for config & secrets_ (Docker Swarm?)
  - [ ] Encryption key?
  - [ ] MongoDB credentials (per database and/or multitenancy)
- [ ] Perform a security audit (see https://medium.com/@nodepractices/were-under-attack-23-node-js-security-best-practices-e33c146cb87d)
- [ ] Develop a bullet-proof concept of encryption
- [ ] Secure MongoDB

## Documentation

- [ ] Add/complete _JsDoc_
- [ ] _Extend Docs_, add diagrams for most important flows

## Minor

- [x] Use `request` for `DynNSUpdater` instead of `simple-get`

## Misc

- [x] Use App-Information (port, required roles etc.) for proxying requests
- [x] Slim down images/builds
- [ ] Pull out library for AppContext
- [ ] Add tests with AppContext
- [ ] Refactor Adminstration and Auth
- [ ] Check refactored DynDNS function on RPI
- [ ] _Tests_ (use Mock MongoDB)
- [ ] _Validations_/central model
