export default {
    USERNAME: {
        pattern: /^[a-zA-Z0-9.\-_@]{5,32}$/i,
        errorMessage: "The username must only contain letters, numbers and following symbols: . - _ @"
    },
    PASSWORD: {
        pattern: /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/g,
        errorMessage: "The password must have at least 8 characters - at least one of each group: a-z, A-Z, 0-9"
    },
    PERMISSION: {
        pattern: /^[a-zA-Z0-9.\-_]{3,32}$/i,
        errorMessage: "Permissions may only contain letters, numbers and following symbols: . - _"
    },
}