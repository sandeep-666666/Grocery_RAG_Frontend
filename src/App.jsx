import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
  XCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const LINKEDIN_URL =
  "https://www.linkedin.com/in/sandeep-kumar-sahoo-39094a301/";

const suggestions = [
  "What grocery items are available?",
  "What fruits are available?",
  "What is the price of rice?",
  "Show me grocery items under ₹200",
];

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! 👋 I’m your Grocery AI Assistant. Ask me anything about the products, prices, or information available in the uploaded grocery catalog.",
};

function App() {
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const askQuestion = async (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    setError("");
    setInput("");

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: Date.now(),
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: trimmedQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to get response from AI.");
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (err) {
      console.error(err);

      if (err.message === "Failed to fetch") {
        setError(
          `Unable to connect to backend. Make sure your server is running on ${API_URL}`,
        );
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion(input);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion(input);
    }
  };

  const clearChat = () => {
    if (loading) return;

    setMessages([welcomeMessage]);
    setInput("");
    setError("");
  };

  return (
    <div className="app">
      {/* NAVBAR */}

      <header className="navbar">
        <div className="brand">
          <div className="brandIcon">🛒</div>

          <div>
            <h1>Sandeep's Grocery AI</h1>
            <p>RAG-powered grocery assistant</p>
          </div>
        </div>

        <button className="clearButton" onClick={clearChat} disabled={loading}>
          Clear Chat
        </button>
      </header>

      {/* MAIN */}

      <main className="container">
        {/* HERO */}

        <section className="hero">
          <div className="heroBadge">
            <Sparkles size={15} />
            AI-powered grocery assistant
          </div>

          <h2>
            Ask anything about
            <br />
            your groceries.
          </h2>

          <p>
            Get accurate answers from the uploaded grocery catalog using
            Retrieval-Augmented Generation.
          </p>

          {/* TECHNOLOGIES */}

          <div className="technologySection">
            <span className="technologyLabel">Built with</span>

            <div className="technologyPills">
              <span>React</span>
              <span>Node.js</span>
              <span>Express.js</span>
              <span>LangChain</span>
              <span>RAG</span>
              <span>Qdrant Vector DB</span>
              <span>Gemini Embeddings</span>
              <span>Groq LLM</span>
              <span>Semantic Search</span>
              <span>PDF Processing</span>
              <span>REST API</span>
              <span>Vector Embeddings</span>
            </div>
          </div>

          {/* DEVELOPER MESSAGE */}

          <div className="developerCard">
            <div className="developerMessage">
              <strong>About this project</strong>

              <p>
                A practical RAG-based AI application that retrieves relevant
                information from a grocery knowledge base and uses an LLM to
                generate contextual answers.
              </p>
            </div>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedinButton"
            >
              <span className="linkedinIcon">in</span>
              <span>Connect with me on LinkedIn</span>
            </a>
          </div>
        </section>

        {/* STATUS */}

        <section className="statusSection">
          <div className="statusCard">
            <div className="statusIcon green">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <strong>AI Ready</strong>
              <span>RAG pipeline connected</span>
            </div>
          </div>

          <div className="statusCard">
            <div className="statusIcon purple">
              <FileText size={19} />
            </div>

            <div>
              <strong>Knowledge Source</strong>
              <span>Grocery catalog PDF</span>
            </div>
          </div>

          <div className="techPills">
            <span>Qdrant</span>
            <span>Gemini Embeddings</span>
            <span>Groq LLM</span>
          </div>
        </section>

        {/* CHAT */}

        <section className="chatCard">
          {/* CHAT HEADER */}

          <div className="chatHeader">
            <div className="chatTitle">
              <div className="botAvatar">
                <Bot size={20} />
              </div>

              <div>
                <strong>Grocery Assistant</strong>

                <span>
                  <i className="onlineDot"></i>
                  Answers from your catalog
                </span>
              </div>
            </div>

            <div className="chatLabel">
              <MessageCircle size={15} />
              RAG Chat
            </div>
          </div>

          {/* MESSAGES */}

          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`messageRow ${
                  message.role === "user" ? "userRow" : ""
                }`}
              >
                <div className={`messageAvatar ${message.role}`}>
                  {message.role === "user" ? (
                    <User size={17} />
                  ) : (
                    <Bot size={17} />
                  )}
                </div>

                <div className={`message ${message.role}`}>
                  <span className="messageRole">
                    {message.role === "user" ? "You" : "Grocery AI"}
                  </span>

                  <p>{message.content}</p>
                </div>
              </div>
            ))}

            {/* LOADING */}

            {loading && (
              <div className="messageRow">
                <div className="messageAvatar assistant">
                  <Bot size={17} />
                </div>

                <div className="message assistant">
                  <span className="messageRole">Grocery AI</span>

                  <div className="typing">
                    <Loader2 size={16} className="spin" />
                    Searching the knowledge base...
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

          {/* SUGGESTIONS */}

          {messages.length === 1 && (
            <div className="suggestions">
              <div className="suggestionTitle">Not sure what to ask?</div>

              <div className="suggestionGrid">
                {suggestions.map((question) => (
                  <button
                    key={question}
                    className="suggestion"
                    onClick={() => askQuestion(question)}
                    disabled={loading}
                  >
                    <span>{question}</span>
                    <Send size={15} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="errorBox">
              <XCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* INPUT */}

          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, prices, availability..."
              rows="1"
              disabled={loading}
            />

            <button
              type="submit"
              className="sendButton"
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <Loader2 size={19} className="spin" />
              ) : (
                <Send size={19} />
              )}
            </button>
          </form>

          <div className="composerHint">
            Press <kbd>Enter</kbd> to send · <kbd>Shift + Enter</kbd> for new
            line
          </div>
        </section>

        {/* HOW IT WORKS */}

        <section className="howItWorks">
          <div className="howText">
            <span className="eyebrow">Under the hood</span>

            <h3>How the AI answers</h3>

            <p>
              Your question is converted into an embedding, matched with
              relevant document chunks in Qdrant, and then passed to the LLM as
              context.
            </p>
          </div>

          <div className="pipeline">
            <PipelineStep number="01" title="Question" text="User query" />

            <div className="arrow">→</div>

            <PipelineStep number="02" title="Embedding" text="Gemini" />

            <div className="arrow">→</div>

            <PipelineStep number="03" title="Retrieval" text="Qdrant" />

            <div className="arrow">→</div>

            <PipelineStep number="04" title="Generation" text="Groq LLM" />
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer>
        <span>
          Built with React · LangChain · Qdrant · Gemini Embeddings · Groq
        </span>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect with Sandeep on LinkedIn"
        >
          <span className="linkedinFooterIcon">in</span>
        </a>
      </footer>
    </div>
  );
}

function PipelineStep({ number, title, text }) {
  return (
    <div className="pipelineStep">
      <span>{number}</span>

      <strong>{title}</strong>

      <small>{text}</small>
    </div>
  );
}

export default App;
