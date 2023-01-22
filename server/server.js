import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req,res) =>{
    res.status(200).send({
        message: 'Hey its Arti the Chatbot'
    })
});

app.post('/', async(req,res) =>{
    try{
        const prompt = req.body.prompt;
        
        // this model is from https://beta.openai.com/playground/p/default-openai-api?model=text-davinci-003
        
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            // contains data for the prompt
            prompt:`${prompt}`,
            // higher temperature value means the model will take more risk
            temperature:0,
            // max tokens to generate || responses
            max_tokens:3000,
            top_p:1,
            // repeating of sentences 
            frequency_penalty:0.5,
            presence_penalty:0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch(err){
        console.log(err)
        res.status(500).send({err})
    }
})

app.listen(6060, () => console.log('Server is running on port http://localhost:6060'))