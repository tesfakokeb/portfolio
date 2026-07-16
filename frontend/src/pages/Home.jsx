import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import Experience from '../components/Experience/Experience.jsx';
import Research from '../components/Research/Research.jsx';
import Projects from '../components/Projects/Projects.jsx';
import Publications from '../components/Publications/Publications.jsx';
import Testimonials from '../components/Testimonials/Testimonials.jsx';
import Skills from '../components/Skills/Skills.jsx';
import Certificates from '../components/Certificates/Certificates.jsx';
import Comments from '../components/Comments/Comments.jsx';
import Contact from '../components/Contact/Contact.jsx';

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export default function Home() {
  return (
    <motion.main id="main-content" {...pageTransition}>
      <Hero />
      <About />
      <Experience />
      <Research />
      <Projects />
      <Publications />
      <Testimonials />
      <Skills />
      <Certificates />
      <Comments />
      <Contact />
    </motion.main>
  );
}
