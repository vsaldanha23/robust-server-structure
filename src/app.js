const express = require("express");
const app = express();

const urlsRouter = require("../src/urls/urls.router");
const usesRouter = require("../src/uses/uses.router");

app.use(express.json());

app.use("/urls", urlsRouter);
app.use("/uses", usesRouter);

// Not found handler
app.use((req, res, next) => {
    next({
        status : 404,
        message: `Not found : ${req.originalUrl}`,
    });

});


// Error handler
app.use((error, req, res, next) => {
    const {status =500 , message = "Something went wrong!"} = error;
    res.status(status).json({error: message});
});

module.exports = app;
