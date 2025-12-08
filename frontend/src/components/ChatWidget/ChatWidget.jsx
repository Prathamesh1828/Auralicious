import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import './ChatWidget.css';

const ChatWidget = () => {
  const { food_list } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm CraveKeeper, Guardian of your cravings! How are you feeling today? I can suggest delicious food based on your mood, preferences, or cravings.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Gemini API key - works with both Vite and Create React App
  const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY ||
    process.env?.REACT_APP_GEMINI_API_KEY ||
    'AIzaSyDxiRpdHkAKI0MNJO81Bsnr8Q3mTtOJ3Rk';

  useEffect(() => {
    console.log('🔍 ChatWidget mounted');
    console.log('🔑 API Key loaded:', GEMINI_API_KEY ? 'Yes' : 'No');

    // Hide tooltip after 5 seconds initially
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(tooltipTimer);
  }, []);

  // Show tooltip again every 30 seconds if chat is closed
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }, 30000);

      return () => clearInterval(interval);
    } else {
      setShowTooltip(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  // FIXED: Gemini API Integration with manual database context
  const getGeminiResponse = async (userMessage) => {
    try {
      console.log('🤖 Calling Gemini API...');

      const menuContext = food_list.map(item =>
        `- ${item.name} (${item.category}): ${item.description} - $${item.price}`
      ).join('\n');

      const prompt = `You are CraveKeeper, the AI food concierge for Auralicious.
      
CURRENT MENU DATABASE:
${menuContext}

USER MESSAGE: "${userMessage}"

YOUR GOAL:
Suggest 2-3 specific items FROM THE MENU ABOVE based on the user's input (mood, weather, craving).

RULES:
1. ONLY suggest items listed in the "CURRENT MENU DATABASE". Do not hallucinate dishes.
2. If the user mentions WEATHER (rain, cold, sunny, hot), suggest matching foods (e.g., hot soups/coffee for rain, ice cream/salad for heat).
3. If the user mentions MOOD (sad, happy, tired), suggest comfort/celebratory/energy foods from the menu.
4. If no specific match is found, suggest popular items from the menu.
5. Keep responses short, friendly, and use emojis.

Respond as a helpful waiter:`;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
          topP: 0.95,
          topK: 40
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();
      console.log('✅ API Response received');

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log('🤖 AI Response:', aiResponse);
        return aiResponse;
      } else {
        console.error('❌ Invalid response structure:', data);
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('💥 Gemini API Error:', error.message);
      return getMoodBasedFallback(userMessage);
    }
  };

  const getMoodBasedFallback = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      return "🎉 That's wonderful! For a happy mood, try our Rainbow Salad, Spring Rolls, or Fresh Fruit Bowl! Light and refreshing! 😊";
    }
    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('upset')) {
      return "💙 Comfort food coming up! Our Mac & Cheese, Chocolate Lava Cake, or Warm Cookie Skillet will lift your spirits! 🍫";
    }
    if (lowerMessage.includes('stressed') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return "😌 Relaxation fuel! Try our Pasta Alfredo, Burrito Bowl, or Chicken Noodle Soup. Add a smoothie for energy! 🍜";
    }
    if (lowerMessage.includes('hungry') || lowerMessage.includes('starving')) {
      return "🍕 Let's satisfy that hunger! Monster Burger, Loaded Pizza, or our Family Combo are perfect! View menu for more! 😋";
    }
    if (lowerMessage.includes('spicy') || lowerMessage.includes('hot')) {
      return "🌶️ Heat lover! Spicy Chicken Wings, Thai Curry, or Jalapeño Tacos will fire you up! Ready to order? 🔥";
    }
    if (lowerMessage.includes('sweet') || lowerMessage.includes('dessert')) {
      return "🍰 Sweet treat time! Chocolate Brownie, Cheesecake, or Ice Cream Sundae are calling your name! 🍨";
    }
    if (lowerMessage.includes('healthy') || lowerMessage.includes('diet') || lowerMessage.includes('fit')) {
      return "🥗 Health-conscious choice! Greek Salad, Grilled Chicken Bowl, or Quinoa Buddha Bowl are perfect! 💪";
    }

    return "I'd love to help! Tell me your mood (happy, stressed, hungry) or what you're craving (spicy, sweet, healthy), and I'll find the perfect food! 🍽️";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    const hardcodedResponse = getHardcodedResponse(currentInput);

    if (hardcodedResponse) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: hardcodedResponse,
          sender: 'bot',
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1000);
    } else {
      try {
        const botResponse = await getGeminiResponse(currentInput);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        }]);
      } catch (error) {
        console.error('Error in handleSendMessage:', error);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Sorry, I'm having a moment! 😅 Try asking about our menu, delivery, or tell me how you're feeling!",
          sender: 'bot',
          timestamp: new Date()
        }]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const getHardcodedResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage === 'hey') {
      return "Hello! I'm CraveKeeper, your personal food guardian! 🍕 Tell me how you're feeling, and I'll suggest the perfect meal for you!";
    }

    if (lowerMessage.includes('menu')) {
      return "🍽️ You can view our full menu by clicking the 'View Menu' button below or on our homepage. We have delicious salads, rolls, desserts, pasta, noodles, and more!";
    }

    if (lowerMessage.includes('hours') || lowerMessage.includes('timing') || lowerMessage.includes('open')) {
      return "⏰ We're open Monday-Sunday from 10:00 AM to 11:00 PM. Order anytime during these hours!";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return "📞 You can reach us at +91 98765 43210 or email us at contact@auralicious.com. We're here to help!";
    }

    if (lowerMessage.includes('delivery') || lowerMessage.includes('deliver')) {
      return "🚚 Yes, we offer delivery! Delivery typically takes 30-45 minutes depending on your location. Free delivery on orders over ₹500!";
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return "💳 We accept all major credit cards, debit cards, UPI, and digital payments including PayPal, Apple Pay, and Google Pay.";
    }

    if (lowerMessage.includes('order status') || lowerMessage.includes('track order')) {
      return "📦 Click 'Order Status' button below to track your order. You can also check 'My Orders' from the menu!";
    }

    return null;
  };

  const quickActions = [
    {
      text: "View Menu",
      action: () => {
        const menuElement = document.getElementById('explore-menu');
        if (menuElement) {
          menuElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = '#explore-menu';
        }
        setIsOpen(false);
      }
    },
    {
      text: "Order Status",
      action: () => {
        navigate('/myorders');
        setIsOpen(false);
      }
    },
    {
      text: "Contact Us",
      action: () => {
        const footerElement = document.getElementById('footer');
        if (footerElement) {
          footerElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = '#footer';
        }
        setIsOpen(false);
      }
    },
    {
      text: "Surprise Me! 🎲",
      action: () => {
        setInputMessage("I'm feeling adventurous! Suggest something exciting");
        setTimeout(() => {
          const input = document.querySelector('.chat-input');
          if (input) input.focus();
        }, 100);
      }
    }
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleChatToggle = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);
  };

  return (
    <>
      {/* Chat Widget Button with Tooltip */}
      <div className={`chat-widget-button ${isOpen ? 'chat-open' : ''}`}>
        {/* Speech Bubble Tooltip */}
        {!isOpen && showTooltip && (
          <div className="chat-tooltip">
            <div className="chat-tooltip-content">
              "Craving something? Ask me! 🤤"
            </div>
            <button
              className="chat-tooltip-close"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Close tooltip"
            >
              ✕
            </button>
          </div>
        )}

        <button
          onClick={handleChatToggle}
          className="chat-toggle-btn"
          aria-label="Toggle chat"
        >
          {isOpen ? '✕' : '🤖'}
          {!isOpen && <span className="chat-notification-dot"></span>}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🍽️</div>
              <div>
                <h4>CraveKeeper</h4>
                <span className="chat-status">Guardian of your cravings</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="chat-close-btn"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="chat-quick-actions">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="quick-action-btn"
              >
                {action.text}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me how you're feeling..."
              className="chat-input"
              autoComplete="off"
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!inputMessage.trim()}
              aria-label="Send message"
            >
              <span className="send-icon">📤</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
