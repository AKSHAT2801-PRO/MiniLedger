import express, { urlencoded } from "express";
import cors from "cors";
import {authRouter} from "./routes/auth"
import {loanRouter} from "./routes/loans"
import {summaryRouter} from "./routes/summary"
import {checkDBConnection} from "./dbconfig"
const PORT = 8088;
const app = express();

app.use(cors());
app.use(express.json());
app.use(urlencoded())
checkDBConnection()

app.use("/auth",authRouter)
app.use("/loans",loanRouter)
app.use("/summary",summaryRouter)



app.get("/", (req, res) => {
  res.send("MiniLedger backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server has Started on PORT: ${PORT}`);
});

