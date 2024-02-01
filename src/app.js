const express = require("express");
const errorHandlingMiddleware = require("./middlewares/error-handling.middleware.js");
const UsersRouter = require("./routes/users.router.js");
const PostsRouter = require("./routes/posts.router.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.js");

dotenv.config();

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", [UsersRouter, PostsRouter]);
app.use(errorHandlingMiddleware);
app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
