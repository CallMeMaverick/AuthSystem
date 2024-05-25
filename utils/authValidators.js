function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
}

function validatePassword(password) {
    // Regex to check for at least 8 characters, at least one letter, and at least one special character
    const regex = /^(?=.*[A-Za-z])(?=.*[@$!%*?&])[A-Za-z@$!%*?&]{8,}$/;
    return regex.test(password.toLowerCase());
}

module.exports = {
    validateEmail,
    validatePassword
}