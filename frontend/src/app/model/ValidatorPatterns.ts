export default {
    USERNAME: {
        pattern: /^[a-zA-Z0-9.\-_@]{3,32}$/,
        errorMessage: "The username must contain 3 - 32 letters, numbers and following symbols: . - _ @"
    },
    PASSWORD: {
        pattern: /^[a-zA-Z0-9.\-_@\w!#$%^&*]{6,128}$/,
        errorMessage: "The password must contain 6 - 128 characters"
    },
    PERMISSION: {
        pattern: /^[a-zA-Z0-9.\-_]{3,32}$/,
        errorMessage: "Permissions must contain 3 - 32 letters, numbers and following symbols: . - _"
    },
}