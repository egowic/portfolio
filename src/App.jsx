import { LangProvider } from './context/LangContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <LangProvider>
      <Nav />
      <Hero />
      <About />
      <ErrorBoundary>
        <Projects />
      </ErrorBoundary>
      <Contact />
    </LangProvider>
  );
}
