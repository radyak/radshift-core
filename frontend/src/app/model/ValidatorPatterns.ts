export default {
    USERNAME: {
        pattern: /^[a-zA-Z0-9.\-_@]{3,32}$/,
        errorMessage: "The username must contain 3 - 32 letters, numbers and following symbols: . - _ @"
    },
    PASSWORD: {
        pattern: /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*\.\-\_])[\w!@#$%^&*\.\-\_]{8,128}$/,
        errorMessage: "The password must contain 8 - 128 characters: 1 lower case and 1 upper case character, 1 number and 1 special character ! @ # $ % ^ & * . - _"
    },
    PERMISSION: {
        pattern: /^[a-zA-Z0-9.\-_]{3,32}$/,
        errorMessage: "Permissions must contain 3 - 32 letters, numbers and following symbols: . - _"
    },
}