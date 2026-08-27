const express = require("express");
const { generateTinaResponse } = require("../services/geminiService");

const router = express.Router();

const OPT_IN_MESSAGE =
  "I'm Tina. I help you choose the right insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?";

router.post("/chat", async (req, res) => {
  try {
    const { conversation } = req.body;

    if (!conversation) {
      return res.status(400).json({
        error: "Conversation is required",
      });
    }

    // First interaction: Tina asks for permission.
    if (conversation.length === 0) {
      return res.json({
        response: OPT_IN_MESSAGE,
      });
    }

    // Check the user's response to the opt-in question.
    if (conversation.length === 2) {
      const userMessage = conversation[1].message.trim().toLowerCase();

      const positiveResponses = [
        "yes",
        "yeah",
        "yep",
        "sure",
        "okay",
        "ok",
        "of course",
      ];

      const agreed = positiveResponses.some((response) =>
        userMessage.includes(response),
      );

      if (!agreed) {
        return res.json({
          response:
            "No problem. I won't ask you any personal questions. If you change your mind, I'm here to help.",
        });
      }
    }

    // Send the conversation to Gemini after the initial opt-in.
    const response = await generateTinaResponse(conversation);

    res.json({
      response,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    res.status(500).json({
      error: "Failed to get a response from Tina",
    });
  }
});

module.exports = router;
