import bodyparser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv'
import express from "express";
import { Configuration, OpenAIApi } from "openai";

dotenv.config()

const configuration = new Configuration({
    organization: process.env.ORGANISATION,
    apiKey: process.env.OPEN_API,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyparser.json());
app.use(cors());

const port = 8080;

app.post('/', async (req, res) => {
  const { message } = req.body;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });
  res.json({
    message: response.data.choices[0].text
  })
});

app.listen(port, () => {
  console.log(`Example app listening at https://locahost:${port}`);
})