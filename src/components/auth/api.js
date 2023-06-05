const express = require("express");
const authCtr = require("./service");

const authRouter = express.Router();
const authMiddleware = require("./../../../middleware/auth.middleware");
// authMiddleware
authRouter.post("/signin", authCtr.login);
authRouter.post("/signin/new_token", authCtr.refreshTokens);
authRouter.post("/signup", authCtr.register);
authRouter.get("/info", authMiddleware, authCtr.userInfo);
authRouter.get("/logout", authMiddleware, authCtr.userInfo);

module.exports = authRouter;
