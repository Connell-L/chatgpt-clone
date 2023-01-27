import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from "express";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.OPEN_API,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;

app.post('/', async (req, res) => {
  const { message, currentModel } = req.body;
  const response = await openai.createCompletion({
    model: `${currentModel}`,
    prompt: `${message}`,
    max_tokens: 100,
    temperature: 0.5,
  });
  res.json({
    message: response.data.choices[0].text
  });
});

app.get('/models', async (req, res) => {
  const getModels = await openai.listModels({});
  res.json({
    models: getModels.data.data
  });
});

app.listen(port, () => {
  console.log(`Example app listening at https://localhost:${port}`);
});
