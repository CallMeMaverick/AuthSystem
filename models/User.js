const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: function() { return !this.googleId && !this.githubId; } },
    googleId: { type: String },
    githubId: { type: String }
});

UserSchema.pre("save", async function (next) {
    // Only hash the password if it is defined
    if (this.password && (this.isModified("password") || this.isNew)) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Instance method to compare candidate's password with hashed password
UserSchema.methods.comparePasswords = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);