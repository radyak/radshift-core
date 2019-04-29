Dependency('backendsConfig', () => {

    return {
        "testapp": {
            "label": "Test-App",
            "description": "Some sample app",
            "host": "testapp",
            "port": 3210,
            "image": "radyak/radshift-testapp:x86-latest",
            "entry": ""
        },
        "portainer": {
            "label": "Portainer",
            "description": "Client w/ UI to inspect and manage Docker containers",
            "host": "portainer",
            "port": 9000,
            "image": "portainer/portainer",
            "entry": ""
        },
        "mongoclient": {
            "label": "Mongo DB Client",
            "description": "Client w/ UI to work with Mongo DB",
            "host": "mongoclient",
            "port": 3000,
            "image": "mongoclient/mongoclient",
            "entry": ""
        }
    }
    
})
