---
trigger: model_decision
description: when working on website UI/UX
---

# Front-end Tech Stack & Architecture
- Framework: React.js (Vite 기반)
- Styling: Tailwind CSS (or Your Choice)
- Animation: GSAP (GreenSock Animation Platform)
- Real-time: WebSockets (Standard WebSocket or Socket.io-client)

## 1. Real-time Auction & Interaction Rules
- **State Management**: Real-time bid data fluctuates in seconds, preventing unnecessary full re-rendering. Use global context or Zstand, etc. for real-time data streams and separate components atomic.
- **WebSocket Connection**: The connection is managed by a single tone structure or custom hook ('useActionSocket') and must be cleaned up ('ws.close()') when unmounting components.
- **Optimistic Updates**: When a user presses the bid button, the UI will first reflect 'Bidding...' or expected status before responding to the server for immediate interaction.

## 2. GSAP Animation Rules
- **React Lifecycle & GSAP**: Since it is a React 18+ environment, GSAP animation must use the 'useGSAP()' hook (or 'useEffect') to prevent memory leakage and ensure clean-up.
- **Performance**: Prevent animations from being triggered all over again whenever real-time data is in. Only changed figures (e.g., auction price rises) should be counted smoothly using the 'gsap.to () linkage method.
- **Interactivity**: Take full advantage of the GSAP timeline ('gsap.timeline()') for microinteractions in case of mouse over, click, bid success/failure.

## 3. Code Style & Quality
- All components are created as functional components, and if TypeScript is used, strict types are applied.
- The UI should maintain a minimal and intuitive design aesthetic.

## 4. Context Management Rules (Strict)
- **TokenMonitor**: As soon as the conversation's Context Window usage exceeds **60%, run the Context Compact process automatically so that it does not interfere with your work in progress.
- **Compact Action**:
  1. It generates a key summary of the real-time auction system architecture, WebSocket event specification, and GSAP animation structure established to date.
  2. Exclude unnecessary previous debugging logs or duplicate codes from the context.
  3. Secure the compressed summary (State Checklist) to the top of the system prompt and continue the conversation.