import { LangProvider } from './context/LangContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  return (
    <LangProvider>
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Contact />
    </LangProvider>
  );
}
