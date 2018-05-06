export const Errors = {
    PASSWORDS_MISSMATCH : {
       code : 1,
       message : "passwords do not match"
    },

    MISSING_DATA : {
        code : 2,
        message : "data is missing"
    },

    INVALID_EMAIL : {
        code : 3,
        message : "invalid email format"
    },

    EMAIL_EXISTS : {
        code : 4,
        message : "email allready used"
    },

    USERNAME_EXISTS : {
        code : 5,
        message : "username allready used"
    },

    SERVER_ERROR : {
        code : 6,
        message : "internal server error"
    },

    INVALID_LOGIN : {
        code : 7,
        message : "invalid login"
    },

    INVALID_USERNAME_OR_PASSWORD : {
        code : 8,
        message : "invalid username or password"
    },

    REGISTRATION_FAILED : {
        code : 8,
        message : "registration failed, try again later"
    },

    PERMISSION_DENIED : {
        code : 9,
        message : "permission denied"
    },

    INVALID_BIRTHDATE_FORMAT : {
        code : 10,
        message : "invalid birthdate format"
    },

    INVALID_PASSWORD_FORMAT : {
        code: 11,
        message: `At least 8 characters, Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`
    },

    INVALID_USERNAME_FORMAT : {
        code: 12,
        message: `Usernames can contain characters a-z, 0-9, underscores and periods.
                  The username cannot start with a period nor end with a period.
                  It must also not have more than one period sequentially.`
    }
}