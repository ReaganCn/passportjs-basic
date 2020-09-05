if (process.env.NODE_ENV !== "production") {
  require("dot-env");
}

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const methodOverride = require("method-override");

const app = express();

const initializePassport = require("./passport-config");

initializePassport(
  passport,
  (username) => users.find((user) => user.username === username),
  (id) => users.find((user) => user.id === id)
);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(flash());
app.use(
  session({
    secret: process.env.SECRET || "gimme",
    resave: false,
    saveUninitialized: false,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'));

const users = [];

app.get("/", checkAuthenticated, (req, res) => {
  res.sendFile(process.cwd() + "/public/home.html");
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.sendFile(process.cwd() + "/public/register.html");
});

app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("register");
  }
  //   console.log(users)
});

app.delete('/logout', (req, res)=> {
    req.logOut()
    res.redirect('login')
})

function checkAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
};

function checkNotAuthenticated (req, res, next){
    if (req.isAuthenticated()) {
        return res.redirect("/");
      }
    
      next();
}

app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
