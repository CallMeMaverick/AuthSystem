const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.pre("save", async function (next) {
    // Check if the password is being modified or if the document is new
    if (this.isModified("password") || this.isNew) {
        // Hash the password with bcrypt and assign it to the password field
        this.password = await bcrypt.hash(this.password, 8);
    }

    // Proceed to next middleware
    next();
});


// Instance method to compare candidate's password with hashed password
UserSchema.methods.comparePasswords = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);