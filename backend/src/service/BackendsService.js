class BackendsService {

    constructor(BackendConfigurationService, DockerApiClient, RadHubClient) {
        this.BackendConfigurationService = BackendConfigurationService
        this.DockerApiClient = DockerApiClient
        this.RadHubClient = RadHubClient
    }

    getAll() {
        return this.DockerApiClient.getAllContainerDetails().then((res) => {
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.mapAllContainerData(res.body)

        }).catch((err) => {
            console.log(`Error while retrieving details of all backends`, err)
            throw err
        })
    }

    get(backendName) {
        var backendConfig = this.BackendConfigurationService.getBackendConfiguration(backendName)

        var containerName = backendConfig.host

        return this.DockerApiClient.getContainerDetails(containerName).then((res) => {

            if (res.statusCode == 404) {
                return null
            }
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }
            
            return this.mapContainerData(res.body)

        }).catch((err) => {
            console.log(`Error while retrieving details of backend ${backendName}:`, err)
            throw err
        })
    }

    getAllAvailable(filter) {
        var installedBackends = this.getAll()
        var availableBackends = this.RadHubClient.getAll(filter).then(res => {
            return JSON.parse(res.body)
        })

        return Promise.all([installedBackends, availableBackends]).then(values => {
            installedBackends = values[0]
            availableBackends = values[1]

            const installedBackendNames = installedBackends.map(backend => backend.name)
            availableBackends.forEach(backend => {
                backend.isInstalled = (installedBackendNames.indexOf(backend.name) !== -1)
            })
            return availableBackends
        })
    }

    start(backendName) {
        var backendConfig = this.BackendConfigurationService.getBackendConfiguration(backendName)

        var containerName = backendConfig.host

        return this.DockerApiClient.startContainer(containerName).then((res) => {
            if (res.statusCode == 404) {
                return null
            }
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.get(backendName)
            
        }).catch((err) => {
            console.log(`Error while starting backend ${backendName}:`, err)
            throw err
        })
    }

    stop(backendName) {
        var backendConfig = this.BackendConfigurationService.getBackendConfiguration(backendName)

        var containerName = backendConfig.host

        return this.DockerApiClient.stopContainer(containerName).then((res) => {
            if (res.statusCode == 404) {
                return null
            }
            if (res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.get(backendName)
            
        }).catch((err) => {
            console.log(`Error while stopping backend ${backendName}:`, err)
            throw err
        })
    }

    create(backendName, onChunkCallback) {
        var backendConfig = this.BackendConfigurationService.getBackendConfiguration(backendName)

        var imageName = backendConfig.image
        var containerName = backendConfig.host

        return this.DockerApiClient.pullImage(imageName, onChunkCallback)
        .then(() => {
            return this.DockerApiClient.createContainer(imageName, containerName)
        })
        .then(() => {
            return this.DockerApiClient.startContainer(containerName)
        })
        .then((result) => {
            console.log('result', result)
            return true
        })
    }

    remove(backendName) {

        var backendConfig = this.BackendConfigurationService.getBackendConfiguration(backendName)
        if (!backendConfig) {
            return null
        }

        return this.stop(backendName)
        .then((res) => {
            if (res && res.statusCode == 404) {
                return null
            }
            if (res && res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            return this.DockerApiClient.removeContainer(backendConfig.host)
        }).then((res) => {
            if (res && res.statusCode >= 500) {
                throw new Error({
                    message: `An error occurred`,
                    response: res
                })
            }

            var image = backendConfig.image
            return this.DockerApiClient.removeImage(image)
        }).then((res) => {
            // Also react to client errors, e.g. in case of wrong image name
            if (res) {
                if (res.statusCode === 404) {
                    return null
                }

                if (res.statusCode >= 500) {
                    throw new Error({
                        message: `An error occurred`,
                        response: res
                    })
                }
            }

            // // TODO: This doesn't feel right ...
            return true
        }).catch((err) => {
            console.log(`Error while removing backend ${backendName}:`, err)
            throw err
        })
    }
            



    mapContainerData(raw) {
        raw = JSON.parse(raw)
        let metaInformation = this.BackendConfigurationService.getBackendConfiguration(raw.Name.substring(1)) || {}
        var name = raw.Name.substring(1)
        return {
            created: raw.Created,
            status: raw.State.Status,
            date: raw.State.StartedAt > raw.State.FinishedAt ? raw.State.StartedAt : raw.State.FinishedAt,
            description: metaInformation.description,
            label: metaInformation.label,
            name: name,
            entry: metaInformation.entry !== undefined ? `/api/${name}/${metaInformation.entry}` : undefined
        }
    }

    mapAllContainerData(raw, showUnknown = false) {
        raw = JSON.parse(raw)
        var result = []
        for (let container of raw) {
            let name = container.Names[0].substring(1)
            let metaInformation = this.BackendConfigurationService.getBackendConfiguration(name)
            if (metaInformation) {
                result.push({
                    status: container.State,
                    name: name,
                    description: metaInformation.description,
                    label: metaInformation.label
                })
            } else if (showUnknown) {
                result.push({
                    status: container.State,
                    name: name,
                    description: 'n/a',
                    label: name
                })
            }
        }
        return result
    }


}

module.exports = BackendsService
