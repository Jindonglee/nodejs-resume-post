const express = require("express");
const errorHandlingMiddleware = require("./middlewares/error-handling.middleware.js");
const UsersRouter = require("./routes/users.router.js");
const PostsRouter = require("./routes/posts.router.js");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.js");
const cors = require("cors");
const KakaoRouter = require("./routes/kakao.router.js");

dotenv.config();

const app = express();
const PORT = 3018;

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://jd-develop.shop:3018",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/users", UsersRouter);
app.use("/resumes", PostsRouter);
app.use("/kakao", KakaoRouter);
app.use(errorHandlingMiddleware);
app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
