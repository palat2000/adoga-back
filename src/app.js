require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error");
const notFoundMiddleware = require("./middlewares/not-found");
const rateLimitMiddleware = require("./middlewares/rate-limit");
const authRoute = require("./routes/auth-route");
const manageRoute = require("./routes/manage-route");

console.clear();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(rateLimitMiddleware);
app.use(express.json());

app.use("/auth", authRoute);
app.use("/manage", manageRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
