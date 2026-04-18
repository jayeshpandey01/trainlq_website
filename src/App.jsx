import React from 'react';
import { useLocation } from 'react-router-dom';
import LegacyPage from './LegacyPage.jsx';
import { resolveLegacyFile } from './legacyPages.js';

export default function App() {
  const location = useLocation();
  const file = resolveLegacyFile(location.pathname);

  if (!file) {
    return (
      <main className="legacy-error">
        <h1>Page not found</h1>
        <p>Requested path: {location.pathname}</p>
      </main>
    );
  }

  return <LegacyPage file={file} />;
}