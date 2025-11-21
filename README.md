# 🎮 Enhanced Tic-Tac-Toe Game with Anime.js

A beautifully animated, modern Tic-Tac-Toe game built with Next.js, Tailwind CSS, and Anime.js for smooth, engaging animations.

## ✨ Features

### 🎬 Animations
- **Board Entrance**: Cells appear with a staggered elastic animation on page load
- **Cell Click Effects**: Smooth scale and rotation animations when placing X/O
- **Winning Line Highlights**: Dynamic highlighting of winning combinations
- **Celebration Particles**: Floating emoji particles when a player wins
- **Button Interactions**: Custom animated buttons with bounce, pulse, and shake effects
- **Score Updates**: Animated score counters with scale transitions
- **Background Elements**: Rotating gradient orbs for ambient visual appeal

### 🎯 Game Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Beautiful dark theme with gradient backgrounds
- **Score Tracking**: Persistent score tracking for both players
- **Win Detection**: Automatic detection of winning patterns and draws
- **Game Reset**: Animated reset with smooth transitions
- **Player Indicators**: Visual feedback for current player turn

### 🎨 UI/UX Enhancements
- **Modern Glass-morphism**: Semi-transparent cards with backdrop blur
- **Gradient Backgrounds**: Dynamic color gradients
- **Interactive Hover Effects**: Smooth hover animations on all interactive elements
- **Visual Feedback**: Clear indicators for game state and player turns
- **Accessibility**: Proper focus states and screen reader support

## 🚀 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Anime.js** - Lightweight JavaScript animation library
- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful SVG icons

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tictactoe-edmyr
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

1. **Start a Game**: The game begins with Player X
2. **Make a Move**: Click on any empty cell to place your mark
3. **Win Condition**: Get three of your marks in a row (horizontal, vertical, or diagonal)
4. **Reset**: Use "New Game" to start fresh or "Reset Stats" to clear scores

## 🎨 Animation Details

### Cell Click Animation
```typescript
const animateCellClick = (index: number) => {
  // Cell scale animation
  anime({
    targets: cell,
    scale: [1, 0.9, 1],
    duration: 300,
    easing: 'easeInOutQuart',
  });

  // Symbol appearance with rotation
  anime({
    targets: symbol,
    scale: [0, 1.3, 1],
    rotate: [0, 360],
    opacity: [0, 1],
    duration: 600,
    easing: 'easeOutBack',
  });
};
```

### Celebration Animation
```typescript
const triggerCelebration = () => {
  anime({
    targets: '.celebration-emoji',
    translateY: [0, -200],
    translateX: () => anime.random(-100, 100),
    rotate: () => anime.random(-180, 180),
    scale: [1, 0],
    opacity: [1, 0],
    duration: 2500,
    delay: anime.stagger(100),
    easing: 'easeOutCubic',
  });
};
```

### Winning Line Animation
```typescript
const animateWinningLine = (line: number[]) => {
  line.forEach((index, i) => {
    anime({
      targets: cell,
      scale: [1, 1.2, 1],
      backgroundColor: ['#ffffff', '#10b981', '#ffffff'],
      duration: 800,
      delay: i * 150,
      easing: 'easeInOutQuart',
    });
  });
};
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main game component
│   └── globals.css        # Global styles
├── components/
│   ├── AnimatedButton.tsx  # Custom animated button component
│   └── ui/                # UI components
└── lib/
    └── utils.ts           # Utility functions
```

## 🎯 Custom Components

### AnimatedButton
A reusable button component with built-in Anime.js animations:
- **Bounce**: Elastic scale effect
- **Pulse**: Gentle scale pulsing
- **Shake**: Horizontal shake animation
- **Glow**: Box-shadow glow effect

```typescript
<AnimatedButton 
  animationType="bounce"
  onAnimatedClick={handleClick}
>
  Click me!
</AnimatedButton>
```

## 🌟 Performance Optimizations

- **Efficient Animations**: Anime.js provides smooth 60fps animations
- **Optimized Re-renders**: Strategic use of React refs to avoid unnecessary re-renders
- **Lazy Loading**: Components and animations load on-demand
- **CSS Optimizations**: Tailwind CSS purges unused styles in production

## 🎨 Customization

The game is highly customizable through:
- **Color Themes**: Easy to modify via Tailwind CSS variables
- **Animation Timing**: Adjustable durations and easing functions
- **Layout**: Responsive grid system for different screen sizes
- **Effects**: Toggle or modify particle effects and transitions

## 🚀 Deployment

The app is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

## 📝 Future Enhancements

- [ ] Online multiplayer support
- [ ] AI opponent with difficulty levels
- [ ] Tournament mode
- [ ] Custom themes and color schemes
- [ ] Sound effects and music
- [ ] Game statistics and analytics
- [ ] Undo/redo functionality
- [ ] Replay system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Enjoy playing this beautifully animated Tic-Tac-Toe game! 🎉**
