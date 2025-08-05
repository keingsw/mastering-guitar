import "./styles/globals.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎸 Mastering Guitar Triads</h1>
        <p>Learn guitar triads through interactive practice</p>
      </header>

      <main className="app-main">
        <div className="welcome-section">
          <h2>Welcome to Guitar Triads Mastery</h2>
          <p>
            Master guitar triads with our interactive fretboard visualization, practice modes, and progress tracking
            system.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <h3>🎵 Interactive Fretboard</h3>
              <p>Visual chord positions and note relationships</p>
            </div>

            <div className="feature-card">
              <h3>🎯 Practice Modes</h3>
              <p>Recognition, construction, and progression exercises</p>
            </div>

            <div className="feature-card">
              <h3>📈 Progress Tracking</h3>
              <p>Monitor your improvement and achievements</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
