Component('backendsConfig', () => {

    return {
        "testapp": {
            "label": "Test-App",
            "description": "Some sample app",
            "host": "testapp",
            "port": 3210,
            "image": "radyak/radshift-testapp:x86-latest",
            "entry": "",
            "security": {
                "rules": [
                    {
                        "resourceMatcher": "\/protected.*",
                        "authenticated": true
                    },
                    {
                        "resourceMatcher": ".*admin.*",
                        "permissions": [
                            "admin"
                        ],
                        "mappings": {
                            "name": "X-User",
                            "scope": "X-Roles"
                        }
                    },
                ],

                "authenticated": true,
                "mappings": {
                    "name": "X-User",
                    "scope": "X-Roles"
                }
            }
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
        },
        "radshift-stream-downloader": {
            "label": "StreamNoMoreFam",
            "description": "Download video & audio from streams",
            "host": "radshift-stream-downloader",
            "name": "radshift-stream-downloader",
            "port": 3009,
            "image": "rpi-workstation/radshift-stream-downloader:x86-latest",
            "entry": ""
        }
    }
    
})

Component('backendsConfig', () => {

    return {
        "testapp": {
            "label": "Test-App",
            "description": "Some sample app",
            "host": "localhost",
            "port": 3210,
            "image": "radyak/radshift-testapp:x86-latest",
            "entry": "",
            "security": {
                "rules": [
                    {
                        "resourceMatcher": "/protected",
                        "authenticated": true
                    },
                    {
                        "resourceMatcher": "/admin/*",
                        "permissions": [
                            "admin"
                        ],
                        // "onUnAuthenticated": 401,
                        "onUnAuthorized": 403,
                        "mappings": {
                            "name": "X-User",
                            "scope": "X-Roles"
                        }
                    },
                ],

                "authenticated": true,
                "mappings": {
                    "name": "X-User",
                    "scope": "X-Roles"
                }
            }
        },
        "portainer": {
            "label": "Portainer",
            "description": "Client w/ UI to inspect and manage Docker containers",
            "host": "localhost",
            "port": 9000,
            "image": "portainer/portainer",
            "entry": ""
        },
        "mongoclient": {
            "label": "Mongo DB Client",
            "description": "Client w/ UI to work with Mongo DB",
            "host": "localhost",
            "port": 3000,
            "image": "mongoclient/mongoclient",
            "entry": ""
        },
        "radshift-stream-downloader": {
            "label": "StreamNoMoreFam",
            "description": "Download video & audio from streams",
            "host": "localhost",
            "port": 3009,
            "image": "rpi-workstation/radshift-stream-downloader:x86-latest",
            "entry": ""
        }
    }
    
}, 'dev-local')
