const express = require("express");

const app = express();

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.listen(port, ()=> {
    console.log(`Server running on port ${port}` )
})