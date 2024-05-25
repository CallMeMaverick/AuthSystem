const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
    // Configuring the local strategy to handle authentication
    passport.use(new LocalStrategy({ usernameField: email }, async (email, password, done) => {
        try {
            // Finding the user by id
            const user = await User.findOne({ email });
            if (!user) {
                // If the user is not found - return with a message
                return done(null, false, { message: "User not found" });
            }

            // Comparing the provided password with the stored hashed password
            const passwordMatch = await User.comparePasswords(password);
            if (!passwordMatch) {
                // If the passwords do not match, return with a message
                return done(null, false, { message: "Incorrect password" });
            }

            // If authentication is successful, return the user
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    // Serializing the user to store his/her id in the session
    passport.serializeUser((user, done) => {
        // Serialize the user ID into the session
        return done(null, user.id);
    })

    // Deserializing the user by fetching user details from the database using the stored ID
    passport.deserializeUser((id, done) => {
        // Find the user by ID in the database and deserialize the user object
        User.findById(id, (err, user) => done(err, user));
    })
}