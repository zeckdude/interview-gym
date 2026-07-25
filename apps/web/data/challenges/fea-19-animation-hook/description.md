# CSS Animation Hook

## What You're Building

Implement `createAnimationController` — a timing-based animation state manager equivalent to what `useAnimation` or Framer Motion provides. Controls animation state transitions with timing.

## Requirements

- `createAnimationController({ duration })` returns `{ play(), pause(), stop(), getState(), getProgress() }`
- States: `'idle' | 'playing' | 'paused' | 'finished'`
- `play()` starts the animation (use provided clock for time tracking)
- `pause()` pauses at current progress
- `stop()` resets to idle, progress = 0
- `getProgress()` returns 0–1 (clamped)
- Accepts a `clock` option for testing: `{ now(): number }`

## Example

```js
let time = 0;
const clock = { now: () => time };
const anim = createAnimationController({ duration: 1000, clock });

anim.play();
time = 500;
anim.getProgress(); // 0.5
time = 1000;
anim.getProgress(); // 1.0
anim.getState(); // 'finished'
```

## Why This Comes Up in Interviews

Animation controllers prove you understand timing models, state machines, and the `requestAnimationFrame` loop. Libraries like Framer Motion and React Spring use these exact patterns internally.

## What You Need to Know

- requestAnimationFrame for smooth animation
- Easing functions (linear, ease-in, ease-out)
- State machine for animation lifecycle
- Why CSS animations are preferred over JS animations for performance
