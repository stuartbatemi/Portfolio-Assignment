// ============================================================
// PASTE THIS INTO: src/App.tsx
// (replace everything that's currently in App.tsx)
//
// This is the simplest possible App.tsx —
// it just imports and renders your Portfolio component.
// ============================================================

import Portfolio from "./components/Portfolio";
// ↑ The ./ means "look in the same folder as App.tsx (which is src/)"
//   then go into components/ and find Portfolio.tsx

function App() {
  return <Portfolio />;
  // That's it — Portfolio.tsx contains everything else
}

export default App;
