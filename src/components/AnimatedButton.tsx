'use client';

import { useRef, ReactNode } from 'react';
import anime from 'animejs';
import { Button, buttonVariants } from './ui/button';
import { VariantProps } from 'class-variance-authority';

interface AnimatedButtonProps extends 
  React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  onAnimatedClick?: () => void;
  animationType?: 'bounce' | 'pulse' | 'shake' | 'glow';
  children: ReactNode;
  asChild?: boolean;
}

export default function AnimatedButton({ 
  onAnimatedClick, 
  animationType = 'bounce', 
  children, 
  onClick,
  className,
  ...props 
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    // Trigger button animation based on type
    switch (animationType) {
      case 'bounce':
        anime({
          targets: buttonRef.current,
          scale: [1, 1.1, 0.95, 1],
          duration: 300,
          easing: 'easeOutElastic(1, .8)',
        });
        break;
      case 'pulse':
        anime({
          targets: buttonRef.current,
          scale: [1, 1.05, 1],
          duration: 200,
          easing: 'easeInOutQuart',
        });
        break;
      case 'shake':
        anime({
          targets: buttonRef.current,
          translateX: [0, -10, 10, -5, 5, 0],
          duration: 400,
          easing: 'easeInOutQuart',
        });
        break;
      case 'glow':
        anime({
          targets: buttonRef.current,
          boxShadow: [
            '0 0 0 rgba(59, 130, 246, 0.5)',
            '0 0 20px rgba(59, 130, 246, 0.8)',
            '0 0 0 rgba(59, 130, 246, 0.5)'
          ],
          duration: 600,
          easing: 'easeInOutQuart',
        });
        break;
    }

    // Call the original click handler
    if (onClick) onClick(e);
    if (onAnimatedClick) onAnimatedClick();
  };

  return (
    <Button 
      ref={buttonRef} 
      onClick={handleClick} 
      {...props}
      className={`transition-all duration-300 ${className || ''}`}
    >
      {children}
    </Button>
  );
}