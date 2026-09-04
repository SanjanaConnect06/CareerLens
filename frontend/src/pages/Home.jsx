import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import About from "../components/home/About";
import CTA from "../components/home/CTA";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <Hero />

      <Features />

      <About />

      <Footer />
    </div>
  );
}
export default Home;