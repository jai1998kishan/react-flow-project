const express = require("express");

const axios = require("axios");
const Chat = require("../models/Chats");

const router = express.Router();

/**
 * @route POST /api/ask-ai
 * @description this get api use to get ai response of the request, it except the prompt
 * @access Public
 */
router.post("/ask-ai", async (req, res) => {
  console.log("ask-ai is called..");
  const model = req.body.model || "mistralai/mistral-7b-instruct-v0.1";

  try {
    const { prompt } = req.body;
    console.log("prompt", prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = response.data.choices[0].message.content;

    res.json({ result });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "AI request failed" });
  }
});

/**
 * @route POST /api/save
 * @description this get api use to save the response of the ai to the mongodb it except the prompt and response
 * @access Public
 */
router.post("/save", async (req, res) => {
  try {
    const { prompt, response } = req.body;

    const chat = new Chat({ prompt, response });
    await chat.save();

    res.json({ message: "Saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "save failed" });
  }
});

module.exports = router;
