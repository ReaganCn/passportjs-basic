const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = getUserByUsername(username);
    if (user == null) {
        console.log( {message:"username not found"})
        return done(null, false, {message:"username not found"})
        
    }

try {
if (await bcrypt.compare(password, user.password)) {
return done(null, user)
} else {
    console.log( {message:"Password incorrect"})
    return done(null, false, {message:"Password incorrect"})
}
} catch(e) {
    return done(e)
}

  };

  passport.use(
    new LocalStrategy({ usernameField: "username" }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    done(null, getUserById(id))
  });
}


module.exports = initialize