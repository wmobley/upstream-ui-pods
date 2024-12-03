import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  textPool: string[];
  speed?: number;
  fixedText?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  textPool,
  speed = 100,
  fixedText,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    let mounted = true;

    const typeInterval = setInterval(() => {
      if (!mounted) return;

      const currentText = textPool[currentTextIndex];
      if (index < currentText.length - 1) {
        setDisplayedText((prev) => prev + currentText[index]);
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          if (mounted) {
            setCurrentTextIndex((prev) => (prev + 1) % textPool.length);
          }
        }, 2000);
      }
    }, speed);

    return () => {
      mounted = false;
      clearInterval(typeInterval);
    };
  }, [textPool, speed, currentTextIndex]);

  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setCursorVisible((visible) => !visible);
    }, 500);
    return () => clearInterval(cursorBlink);
  }, []);

  return (
    <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
      {fixedText}
      <br />
      {displayedText}
      <span
        className={`inline-block w-1 bg-gray-800 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        &nbsp;
      </span>
    </h2>
  );
};

export default TypingEffect;
