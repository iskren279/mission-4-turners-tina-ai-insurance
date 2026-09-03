import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/insurance/chat";

function App() {
  // show this
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    if (!message.trim() || loading) return;

    const userMessage = {
      role: "user",
      message: message.trim(),
    };

    const updatedConversation = [...conversation, userMessage];

    setConversation(updatedConversation);
    setInput("");
    setLoading(true);

    // show this
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: updatedConversation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setConversation([
        ...updatedConversation,
        {
          role: "assistant",
          message: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setConversation([
        ...updatedConversation,
        {
          role: "assistant",
          message: "Sorry, I couldn't connect to Tina right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async () => {
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: [],
        }),
      });

      const data = await response.json();

      setConversation([
        {
          role: "assistant",
          message: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h1>Tina</h1>
        <p className="subtitle">Insurance Recommendation Assistant</p>

        <div className="chat-box">
          {conversation.length === 0 && !loading && (
            <button className="start-button" onClick={startChat}>
              Start Chat
            </button>
          )}

          {conversation.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.role === "user" ? "user-message" : "tina-message"
              }`}
            >
              <strong>{message.role === "user" ? "You" : "Tina"}</strong>

              <p>{message.message}</p>
            </div>
          ))}

          {loading && (
            <div className="message tina-message">
              <strong>Tina</strong>
              <p>Thinking...</p>
            </div>
          )}
        </div>

        <form
          className="input-area"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your response..."
            disabled={loading}
          />

          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
