"use client";

import React, { useState, useEffect } from 'react';

interface TextTypeProps {
  text: string | string[];
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  onComplete?: () => void;
  className?: string;
  renderAsMarkdown?: boolean;
  showStopButton?: boolean;
  onStop?: () => void;
  isStopRequested?: boolean;
}

const TextType: React.FC<TextTypeProps> = ({
  text,
  typingSpeed = 80, // Slower speed for more ChatGPT-like experience (80ms per word)
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "|",
  onComplete,
  className = "",
  renderAsMarkdown = false,
  showStopButton = false,
  onStop,
  isStopRequested = false
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false); // Disabled typing
  const [showCursorState, setShowCursorState] = useState(false); // Disabled cursor
  const [isStopped, setIsStopped] = useState(false);

  // Convert text to string if it's an array
  const fullText = Array.isArray(text) ? text.join(" ") : text || "";

  // Show full text immediately without typing effect
  useEffect(() => {
    setDisplayText(fullText);
    setIsTyping(false);
    if (onComplete) {
      onComplete();
    }
  }, [fullText, onComplete]);

  // Function to stop typing - preserve what's already displayed
  const handleStop = () => {
    setIsStopped(true);
    setIsTyping(false);
    if (onStop) {
      onStop();
    }
  };

  // Enhanced render response with proper paragraph spacing
  const renderResponse = (response: string) => {
    // Only split on double line breaks for true paragraphs, not single line breaks
    const paragraphs = response.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length <= 1) {
      // Single block of text - render as one paragraph, preserving spaces but not forcing line breaks
      const cleanText = response.trim().replace(/\*\*|\*/g, "").replace(/\n/g, " ");
      return (
        <div className="leading-relaxed text-gray-800 dark:text-gray-200">
          {cleanText}
        </div>
      );
    } else {
      // Multiple paragraphs - only break on double line breaks
      return (
        <div className="space-y-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-gray-800 dark:text-gray-200">
              {paragraph.trim().replace(/\*\*|\*/g, "").replace(/\n/g, " ")}
            </p>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="relative">
      <span className={`${className} leading-relaxed`}>
        {renderAsMarkdown ? (
          renderResponse(displayText)
        ) : (
          <span 
            className="leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: displayText.replace(/\n\n/g, '<br class="mb-4"><br class="mb-2">') }} 
          />
        )}
      </span>
    </div>
  );
};

export default TextType;
