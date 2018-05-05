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
        code : 9,
        message : "invalid birthdate format"
    }
}