import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Users, 
  Utensils, 
  ChefHat, 
  Calendar, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  Target,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Linkedin,
  Quote,
  Play
} from 'lucide-react';

// --- Types ---
type Page = 'home' | 'story' | 'cookouts' | 'involved' | 'press' | 'founders';

// --- Constants ---
const smoothEase = [0.22, 1, 0.36, 1];

// --- Shared Components ---

const Logo = () => {
  const colorClass = 'text-brand-charcoal';
  const barClass = 'bg-brand-charcoal';
  const subColorClass = 'text-brand-charcoal/90';
  
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <div className={`w-[2px] h-8 md:h-10 ${barClass} hidden sm:block opacity-30`} />
      <div className="flex flex-col leading-tight">
        <span className={`font-display text-xl md:text-3xl tracking-tight leading-none ${colorClass}`}>
          masterchef4many
        </span>
        <span className={`font-sans text-[9px] md:text-[12px] font-bold tracking-tight ${subColorClass}`}>
          good food for everyone
        </span>
      </div>
    </div>
  );
};

const ScrollProgressBar = ({ page }: { page: Page }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress((window.scrollY / scrollHeight) * 100);
      } else {
        setProgress(0);
      }
    };
    
    updateScroll(); // Initial check
    window.addEventListener("scroll", updateScroll);
    
    const resizeObserver = new ResizeObserver(() => {
      updateScroll();
    });
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      resizeObserver.disconnect();
    };
  }, [page]);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
      <motion.div 
        className="h-full bg-brand-orange shadow-[0_0_10px_rgba(216,90,48,0.5)]"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </div>
  );
};

const AnimatedTextReveal = ({ text, className = "" }: { text: string, className?: string }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '' 
}: { 
  children: ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'outline' | 'white';
  className?: string;
}) => {
  const baseStyles = "px-6 py-3 rounded-md font-semibold transition-all duration-300 text-sm flex items-center gap-2 group cursor-pointer";
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-brand-orange/90",
    outline: "border-2 border-brand-orange text-brand-orange hover:bg-brand-orange/5",
    white: "bg-white text-brand-orange hover:bg-white/90"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const SectionHeading = ({ 
  eyebrow, 
  title, 
  subtitle,
  className = ""
}: { 
  eyebrow?: string; 
  title: string; 
  subtitle?: string;
  className?: string;
}) => (
  <div className={`mb-12 ${className}`}>
    {eyebrow && <span className="text-brand-orange font-bold uppercase tracking-widest text-xs mb-2 block">{eyebrow}</span>}
    <h2 className="font-display text-4xl md:text-5xl text-brand-charcoal mb-4">{title}</h2>
    {subtitle && <p className="text-brand-charcoal/80 max-w-2xl text-lg leading-relaxed">{subtitle}</p>}
  </div>
);

const PAGES = ['home', 'story', 'involved', 'press', 'founders'];

// --- Page Components ---


interface PageProps {
  setPage: (p: Page) => void;
}

const StatCounter: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const [displayValue, setDisplayValue] = useState(numericValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const suffix = value.replace(/[0-9]/g, '');

  const animate = (fromUser: boolean = false) => {
    if (isAnimating) return;
    setIsAnimating(true);
    let startValue = 0;
    const duration = 1500;
    const endValue = numericValue;
    const frames = duration / 16;
    const increment = endValue / frames;
    
    setDisplayValue(0);
    
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue >= endValue) {
        setDisplayValue(endValue);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(startValue));
      }
    }, 16);
  };

  return (
    <motion.div 
      className="flex flex-col items-center text-center space-y-1 cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        // Trigger sequential animation on scroll
        setTimeout(() => animate(false), index * 200 + 300);
      }}
      onMouseEnter={() => animate(true)}
      transition={{ 
        duration: 0.8,
        delay: index * 0.1,
        ease: smoothEase
      }}
    >
      <div className="text-3xl md:text-6xl font-display font-black text-brand-charcoal tracking-tighter">
        {displayValue.toLocaleString()}{suffix}
      </div>
      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40 pt-1">{label}</div>
    </motion.div>
  );
};

const VisionCarousel = ({ className = "" }: { className?: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const visionItems = [
    {
      year: "2018",
      title: "The Symphony of Flavor",
      description: "We started with a radical belief: that nourishment isn't just about calories, it's about dignity. Our first cookouts at restaurant kitchens introduced children to 'new-age' food with premium ingredients—the MasterChef way! Whether it was creamy pasta or black bean burgers that children playfully called 'Rajmawala Vada Pav', we realized that every child deserves to feel like a chosen guest.",
      image: "https://static.wixstatic.com/media/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg",
      stat: "74 Hearts Touched"
    },
    {
      year: "2020",
      title: "The Good Food Revolution",
      description: "When Mumbai fell silent during the lockdown, our kitchens roared. We launched 'The Good Food Drive,' mobilizing 200+ private home kitchens into a decentralized nutrition engine. Families bonded over baking lasagna and preparing wholesome burgers for thousands of children in need. It was a testament to the power of a community that refuses to let its children go hungry when the world stops.",
      image: "https://static.wixstatic.com/media/6c293b_9b4bfa6570754c12ae7cc700d3061642~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_9b4bfa6570754c12ae7cc700d3061642~mv2.jpg",
      stat: "135,000+ Moments of Hope"
    },
    {
      year: "2024",
      title: "Sustainable Sustenance",
      description: "Growth brought responsibility. To move from sporadic joy to daily health, we established the Children’s Nutrition Project (CNP). We now provide 500 children in BMC shelters with balanced, high-protein gourmet lunches every single day. By partnering with local micro-caterers, we’ve created a circular ecosystem that supports the local economy while securing the health of our youth.",
      image: "https://static.wixstatic.com/media/6c293b_7c64f45154ea490786ef558071923e65~mv2.jpg/v1/fill/w_491,h_491,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c293b_7c64f45154ea490786ef558071923e65~mv2.jpg",
      stat: "500 Daily Beneficiaries"
    },
    {
      year: "Beyond",
      title: "Mumbai's Culinary Horizon",
      description: "Our dream is a city where every child has access to global flavors and essential nutrients. We're evolving into a platform that empowers the next generation of food leaders while ensuring zero-hunger at the grassroots. From black-bean burgers to nutrient-dense ramen, we're redefining what it means to be a modern, compassionate city through the simplest of acts: sharing a meal.",
      image: "https://static.wixstatic.com/media/6c293b_2a57b057a7934a5bbcb2b59cd43312a3~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_2a57b057a7934a5bbcb2b59cd43312a3~mv2.jpg",
      stat: "5,000 Meals Goal"
    }
  ];

  return (
    <section className={`max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden my-8 md:my-16 border border-brand-border shadow-sm relative ${className}`}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-orange/5 to-transparent pointer-events-none" />
      
      <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        <div className="space-y-6 md:space-y-12">
          <div className="space-y-2 md:space-y-4">
            <motion.span 
              className="text-brand-orange font-bold uppercase tracking-widest text-[10px] md:text-xs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              Our Vision & Evolution
            </motion.span>
            <h2 className="font-display text-4xl md:text-6xl text-brand-charcoal leading-tight">
              A journey of <span className="text-brand-orange italic">purpose</span>
            </h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {visionItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-bold transition-all shrink-0 uppercase tracking-wider ${
                    activeIndex === idx 
                      ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/40" 
                      : "bg-brand-orange-light text-brand-orange hover:bg-brand-orange hover:text-white"
                  }`}
                >
                  {item.year}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: smoothEase }}
                className="space-y-4 md:space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 md:w-12 bg-brand-orange" />
                  <h3 className="font-display text-xl md:text-3xl text-brand-charcoal">{visionItems[activeIndex].title}</h3>
                </div>
                <p className="text-gray-500 text-sm md:text-lg leading-relaxed max-w-lg">
                  {visionItems[activeIndex].description}
                </p>
                <div className="pt-2 md:pt-4">
                  <div className="inline-flex items-center gap-3 bg-brand-orange-light px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-brand-orange/10">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-brand-orange" />
                    <span className="text-brand-charcoal text-xs md:text-base font-medium">{visionItems[activeIndex].stat}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
             {visionItems.map((_, idx) => (
               <div 
                 key={idx}
                 className={`h-1 rounded-full transition-all duration-500 ${
                   activeIndex === idx ? "w-8 md:w-10 bg-brand-orange" : "w-1 bg-brand-orange/20"
                 }`}
               />
             ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] md:aspect-[16/10] lg:aspect-square overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-xl bg-brand-orange-light">
          <AnimatePresence mode="wait">
            {visionItems[activeIndex].image ? (
              <motion.img
                key={activeIndex}
                src={visionItems[activeIndex].image}
                alt={visionItems[activeIndex].title}
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0 }}
                transition={{ duration: 0.6, ease: smoothEase }}
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            ) : (
              <motion.div 
                key="placeholder"
                className="absolute inset-0 bg-brand-orange/10 flex items-center justify-center p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-brand-orange/20 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-brand-orange" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC<PageProps> = ({ setPage }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-0"
    >
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[65vh] flex flex-col items-center justify-center overflow-hidden bg-brand-charcoal pt-16 md:pt-20 pb-10 md:pb-12">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://static.wixstatic.com/media/11062b_cacb6249b6024b61b2d8a8594b7dbb4c~mv2.jpg/v1/fill/w_1470,h_536,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_cacb6249b6024b61b2d8a8594b7dbb4c~mv2.jpg" 
            alt="The Children's Nutrition Project" 
            className="w-full h-full object-cover opacity-100"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          <div className="absolute inset-0 bg-brand-charcoal/60" />
        </div>

        <div className="relative z-10 text-center space-y-8 md:space-y-12 px-6 max-w-7xl mx-auto pb-8 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: smoothEase, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-[8rem] lg:text-[11rem] font-sans font-black text-[#FDE2DC] leading-[0.9] md:leading-[0.85] mb-8 md:mb-12 tracking-tighter lowercase">
              the childrens <br />
              <span className="text-white">nutrition project</span>
            </h1>
            <p className="text-lg md:text-4xl text-white font-bold max-w-4xl mx-auto leading-tight mb-8 md:mb-12 tracking-tight px-4 md:px-0">
              Take Action Now to Support the Nutritional Needs of 500 Children
            </p>
            
            <motion.div 
              className="flex justify-center pb-8 md:pb-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <button 
                onClick={() => window.open('https://pages.razorpay.com/masterchef4many', '_blank')} 
                className="h-12 md:h-14 px-8 md:px-12 text-sm md:text-base bg-[#FDE2DC] text-brand-charcoal hover:bg-white transition-all shadow-lg font-sans font-bold uppercase tracking-widest"
              >
                Donate Now
              </button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#FDE2DC] to-transparent opacity-60" />
        </motion.div>
      </section>

      {/* Impact Stats */}
      <section className="pt-12 pb-6 bg-brand-cream relative z-10 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12 lg:gap-24">
            {[
              { label: 'Meals Served', val: '400k+', icon: Target },
              { label: 'Volunteers', val: '300+', icon: Users },
              { label: 'Shelter Homes', val: '15+', icon: MapPin },
              { label: 'Families Engaged', val: '250+', icon: Heart },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center text-center space-y-6 group"
              >
                <div className="relative">
                  <motion.div 
                    className="w-14 h-14 md:w-16 md:h-16 rounded-3xl bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-brand-orange/20"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <motion.div 
                    className="absolute -inset-2 bg-brand-orange/5 rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div className="space-y-1">
                  <StatCounter value={stat.val} label={stat.label} index={i} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="pt-8 md:pt-10 pb-6 md:pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block">The M4M Ethos</span>
              <h2 className="text-4xl md:text-6xl font-display tracking-tight leading-tight">Food That Nourishes <br />The Soul.</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe that every child deserves more than just calories. They deserve high-quality, delicious food that makes them feel seen and valued. 
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                Our approach merges the culinary standards of Mumbai's finest restaurants with the emotional warmth of home-cooked meals. It's about dignity, consistent support, and the collective power of a community.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-display font-bold text-brand-charcoal mb-2">Quality</div>
                <p className="text-xs text-gray-400 font-medium">Standardized, nutritious ingredients sourced with care.</p>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-brand-charcoal mb-2">Consistency</div>
                <p className="text-xs text-gray-400 font-medium">Daily and weekly support ensuring nobody is left behind.</p>
              </div>
            </div>
            <Button onClick={() => setPage('story')} variant="outline" className="h-14 px-8 group">
              Our Full Story <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://static.wixstatic.com/media/6c293b_617cf235aaa3449d8901e8f7d9659840~mv2.jpg/v1/fill/w_491,h_491,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c293b_617cf235aaa3449d8901e8f7d9659840~mv2.jpg" 
                className="w-full h-full object-cover"
                alt="Our Vision"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-brand-orange/10 rounded-full blur-[80px] -z-10" />
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-dark-orange rounded-3xl -z-10 shadow-2xl flex items-center justify-center p-6 text-white text-center font-display text-xs">
              M4M 2026 Strategy
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="pt-8 md:pt-10 pb-6 md:pb-8 bg-brand-cream/30 border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="text-brand-orange font-bold text-xs uppercase tracking-widest block mb-4">Our Portfolios</span>
              <h2 className="text-4xl md:text-5xl font-display tracking-tight leading-tight">Strategic Initiatives for <br />Mumbai's Children.</h2>
            </div>
            <button 
              onClick={() => setPage('story')}
              className="text-brand-charcoal hover:text-brand-orange transition-colors font-bold uppercase tracking-widest text-xs flex items-center gap-2 group"
            >
              See All Work <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Good Food Drive",
                area: "2020 - 2024",
                desc: "A massive pandemic initiative that mobilized hundreds of home-chefs to provide dignity through warm meals.",
                img: "https://static.wixstatic.com/media/6c293b_ac09700dba434696b355a357a5a38101~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_ac09700dba434696b355a357a5a38101~mv2.jpg",
                id: 'story'
              },
              {
                title: "Sustainability (CNP)",
                area: "2024 - 2026",
                desc: "Ensuring 500 children receive balanced, high-protein lunches every single day across Mumbai.",
                img: "https://static.wixstatic.com/media/6c293b_9b4bfa6570754c12ae7cc700d3061642~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_9b4bfa6570754c12ae7cc700d3061642~mv2.jpg",
                id: 'story'
              }
            ].map((proj, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                onClick={() => setPage(proj.id as Page)}
                className="group cursor-pointer space-y-6"
              >
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all relative">
                  <img src={proj.img} alt={proj.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white/60 font-bold uppercase tracking-widest text-[10px] mb-2">{proj.area}</span>
                    <h3 className="text-xl font-display text-white">{proj.title}</h3>
                  </div>
                </div>
                <div className="px-2">
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest block mb-2">{proj.area}</span>
                  <h3 className="text-2xl font-display group-hover:text-brand-orange transition-colors">{proj.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mt-2">{proj.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <motion.section 
        className="bg-white pt-8 md:pt-10 pb-6 md:pb-8 px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
          <div className="text-center space-y-4">
             <span className="text-brand-orange font-bold text-xs uppercase tracking-widest">Global Impact</span>
             <h2 className="text-3xl md:text-5xl font-display">Recognition & Media</h2>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex flex-col items-center gap-3 group cursor-pointer">
               <div className="w-16 h-16 rounded-full border-2 border-brand-charcoal/10 flex items-center justify-center font-display text-[10px] font-bold p-3 text-center leading-tight group-hover:border-brand-orange transition-colors">DIANA AWARD</div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40 group-hover:text-brand-orange transition-colors">United Kingdom</span>
            </div>
            <div className="flex flex-col items-center gap-1 group cursor-pointer">
              <div className="font-display text-5xl font-black italic tracking-tighter group-hover:text-brand-orange transition-colors">mid-day</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40 group-hover:text-brand-orange transition-colors">Mumbai Edition</span>
            </div>
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="font-display text-3xl font-bold uppercase tracking-tight group-hover:text-brand-orange transition-colors">Free Press</div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40 group-hover:text-brand-orange transition-colors">Journal</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => setPage('press')}
            className="mt-4 border-brand-charcoal/10 text-brand-charcoal hover:bg-brand-dark-orange hover:text-white"
          >
            Explore Press Coverage <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </motion.section>

      <VideoGallery />

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-brand-orange-light relative overflow-hidden border-t border-brand-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(233,30,99,0.05),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 md:space-y-8 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: smoothEase }}
            className="text-2xl sm:text-3xl md:text-5xl font-display text-brand-charcoal leading-tight"
          >
            Will you help us reach <br />the <span className="text-brand-orange italic underline decoration-brand-orange decoration-2 underline-offset-4">next million?</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: smoothEase, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button onClick={() => window.open('https://pages.razorpay.com/masterchef4many', '_blank')} className="h-10 md:h-12 px-6 md:px-8 text-xs md:text-sm w-full sm:w-auto shadow-md shadow-brand-orange/20 justify-center">
              Donate Now
            </Button>
            <Button onClick={() => setPage('involved')} variant="outline" className="h-10 md:h-12 px-6 md:px-8 text-xs md:text-sm bg-white w-full sm:w-auto justify-center">
              Become a Volunteer
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

const PressPage: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  const articles = [
    {
      id: "fighting-lockdown",
      source: "Mid-Day",
      date: "October 15, 2021",
      title: "Fighting lockdown with lasagna",
      subtitle: "Teenage home chef combines his love for gourmet-style cooking with passion for sharing meals with the less-privileged during lockdown.",
      image: "https://static.wixstatic.com/media/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg",
      text: "Dev Dalmia, 15, challenged the stereotype of charity meals being just dal-chawal. He mobilized over 100 families to cook 135,000+ gourmet meals including pasta Alfredo, chocolate cookies, and burgers for children in shelters across Sewri, Matunga, and Sion.",
      fullText: `WHERE charity meals are often associated with humble dal, rice, roti and sabzi, Dev Dalmia, 15, is challenging the stereotype with portions of black bean noodles, ravioli, mac and cheese, chocolate fudge cookies and burgers.

The Warden Road resident was 13 when he started The Good Food Drive by masterchef4many to feed lesser privileged kids cooked gourmet meals. With help from his mother Anu, he got four restaurants on board to offer their kitchens and ingredients to a group of teens who'd get together for occasional cookouts. "The lockdown taught me how good food could be a game-changer on a gloomy day. We sent meals to kids in shelters, orphanages and bastis across Sewri, Matunga, Sion, Mahalaxmi and Lower Parel. Since restaurant kitchens were shut, we operated from our home kitchen," he says.

What began with 19 boxes of masala khichdi served with pickle and mango on May 17, 2020, turned into 12,000-plus gourmet meals cooked by 100 families. "My friends Diya Bhageria and Tanisha Laud were the first to join our food army. We used our WhatsApp networks and created an Instagram page to spread the word. More families came on board each day and stuck on. It warmed our hearts to see young chefs go the extra mile adding more treats with each meal box! Our volunteers were the real superheroes who risked their safety to ensure the meals reached the needy," adds the Class 10 student.`
    },
    {
      id: "spreading-smiles",
      source: "Mid-Day",
      date: "May 2020",
      title: "Spreading smiles...one cookie at a time!",
      subtitle: "City kids give charity meals a gourmet twist by dishing out restaurant-style food.",
      image: "https://static.wixstatic.com/media/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg",
      text: "Dev Dalmia along with his friends Diya Bhageria and Tanisha Laud started the Food Drive to bring joy to children's lives. They served burgers, pasta, ravioli, and cookies, believing that food should feed the heart as much as the body.",
      fullText: `Dal rice khichdi is what comes to mind when one thinks of charity meals. But what if we tell you there are a bunch of spunky teenagers who are cooking gourmet food and distributing it among the underprivileged? Dev Dalmia, 15, along with his friends, is doing just that. Masterchef4many was started by Dev when he was in Grade 8. At the time, Dev along with his friends would occasionally use restaurant kitchens to make fancy food like burger, pasta, cookies etc and distribute it amongst the underprivileged children in the city. The motive was not just to feed them or satisfy their hunger but to add some joy in their lives.

The campaign soon became bigger when Dev's friends Diya Bhageria and Tanisha Laud and their mums joined in. "When the initiative started, Tanisha and I were brainstorming with Dev and we came up with a plan to get the word out. We told our teachers, friends... We all like food and cooking and we realised while many of us were grumbling about the pandemic and the lockdown there were people in worse situation than us. I wanted to not only fill their stomach, but give them an opportunity to be exposed to something they have never eaten before. We cook fancy food for them to give them a taste of and share our passion for food," says Diya.`
    },
    {
      id: "onp-mission",
      source: "M4M Mission",
      date: "September 2024",
      title: "The Orphanage Nutrition Project (ONP)",
      subtitle: "Joy and equality through food: Miraya Dalmia's mission to ensure consistent nutrition for Mumbai's orphans.",
      image: "https://static.wixstatic.com/media/6c293b_a0e48698aab04e5d968997b931b38033~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_a0e48698aab04e5d968997b931b38033~mv2.jpg",
      text: "Miraya Dalmia launched ONP to move from occasional treats to daily sustenance. Starting with 70 children, the project has expanded to provide fresh fruits, veggies, and gourmet-style healthy meals to over 275 children across three institutions.",
      fullText: `Miraya Dalmia is a high school student who has been a witness to the success of her brother Dev's food drive during the COVID-19 lockdown. After the lockdown, Miraya felt a sense of purpose to reach out and help many. She started wondering - "How could we make a real impact? How can we solve a problem with our food drive?" 

She spent months understanding the needs of orphans at orphanages. She concluded that though the basic meal was good to satiate one's hunger, it lacked nutritious products which a growing child needs for their physical and mental development. Nutrition in the formative childhood years play a major role in how the child will grow up physically, mentally and in spirit. 

The Orphanage Nutrition Project (ONP) began in September 2024 with just one orphanage of 70 children and has expanded to 3 institutes comprising of over 275 children. Children look forward to receiving weekly supplies of fresh fruits, green leafy vegetables, dates and nuts. Along with the healthy food, the weekly distribution van also carries a deliciously prepared hot, freshly cooked meal which the children would never eat at these homes - felafel sandwiches, burrito bowls, hummus and carrot sticks, salads, yogurt, pastas, butter paneer. Joy and equality through food is the true essence of masterchef4many.`
    },
    {
      id: "reco-letter",
      source: "Recognition",
      date: "Pandemic Record",
      title: "RECO LETTER FOR DEV FOR M4M",
      subtitle: "A testament to leadership and compassion: How a teenager mobilised a city of students.",
      image: "https://static.wixstatic.com/media/11062b_cacb6249b6024b61b2d8a8594b7dbb4c~mv2.jpg",
      text: "Dev Dalmia mobilised over 300 school students to provide 135,000+ meals. This letter highlights his ability to manage a complex supply chain of home kitchens to ensure children on the streets of Mumbai received nutritious and delicious food.",
      fullText: `Dev, a high school student of 15 years at the time when the COVID 19 lockdown was imposed in India, started a home kitchen to provide meals to street children. He mobilised over 300 other school students to volunteer for the same and together they provided over 135,000 meals to the underprivileged children on the streets of Mumbai.

Instead of focussing on the number of meals (which at 135,000 meals is HUGE), what impressed me about Dev was his compassion and sensitivity towards the plight of his underprivileged brethren. Dev did not just want to address the physical body urge of hunger in the children but also wanted to make them happy in their hearts. He did so by not providing but sharing meals. He inspired his co-volunteers to make meals that they would personally have at their home and share that. 

One skill which Dev mastered in this movement is "management". Dev showed initiative in starting the movement, widening it, sustaining it and most importantly managing it when the base of volunteers increased. He laid down the entire detailed process of cooking, packing, collecting and delivery so that the meal reached fresh and in time. He learned to balance his head and heart beautifully at this young age.`
    },
    {
      id: "social-media",
      source: "Strategy",
      date: "June 2020",
      title: "Social Media Growth Plan",
      subtitle: "MasterChef4Many Social Media Growth Strategy: Beyond Followers to Community.",
      image: "https://static.wixstatic.com/media/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg",
      text: "A strategic roadmap detailing MasterChef4Many's plan to reach 5,000 followers and build a robust community of supporters through transparent storytelling and engagement.",
      fullText: `MasterChef4Many Social Media Growth Plan
Target - 5000 Followers by 30.09.2020

Story Highlight Reels for:
● Activities ● Recipes ● Endorsements ● Testimonials

Instagram Feed:
● 15 Posts a month: 5 Updates, 5 Food / Recipe Posts, 5 Collaborative Posts.
● 1 Instagram Live / Week with a friend / well-wisher

Growth Hacking:
● Word of Mouth: Volunteers share the handle with 50 Friends each week and make sure at least 80% convert to Followers.
● IG Ads: Promotion topics include Food Recipes and "How can one help".
● Engagement: Liking and Commenting on Profiles that have mutually interested followers.

This plan focuses on high-quality content and authentic community building to ensure our mission reaches a wider audience.`
    },
    {
      id: "the-hindu",
      source: "The Hindu",
      date: "June 2020",
      title: "A MasterChef with a Mission",
      subtitle: "How a student-led initiative is changing the landscape of food security in Mumbai.",
      image: "https://static.wixstatic.com/media/6c293b_915f1613b8574236b84b9f4efc5403bf~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_915f1613b8574236b84b9f4efc5403bf~mv2.jpg",
      text: "The Hindu features MasterChef4Many's journey of transforming standard grocery donation into a movement of dignity and gourmet food, highlighting the organizational efficiency of these young founders.",
      fullText: `The Hindu features MasterChef4Many's journey of transforming standard grocery donation into a movement of dignity and gourmet food, highlighting the organizational efficiency of these young founders.`
    }
  ];

  const highlights = [
    { title: "The Diana Award", award: "National Award for Social Action & Humanitarian Work" },
    { title: "Free Press Journal", award: "Featured for Youth Empowerment & Community Service" },
    { title: "Economic Times", award: "Pan-India Recognition for Pandemic Relief Efforts" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-16 md:pb-20"
    >
      <PageHeader 
        eyebrow="In the News"
        title="Making Global <br />Headlines"
        subtitle="Our mission has resonated across borders, from local Mumbai dailies to international awards."
        image="https://static.wixstatic.com/media/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg"
      />

      <div className="px-6 max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl">
          <SectionHeading 
            eyebrow="MasterChef4Many in the News"
            title="Sharing our mission with the world"
            subtitle="Our journey has been featured in leading publications for redefining charity through quality, love, and gourmet cooking."
          />
        </div>

        {/* Recognition Carousel */}
        <section className="px-2 overflow-hidden -mt-4 mb-4">
          <RecognitionCarousel items={[...highlights, ...[
            { title: "Times of India", award: "Youth Social Impact Awards", year: "2024" },
            { title: "Hindustan Times", award: "Top 10 Pandemic Relief Initiatives", year: "2023" },
            { title: "Verve Magazine", award: "The Future of Philanthropy", year: "2022" },
            { title: "Social Samosa", award: "Best Community Driven Campaign", year: "2021" }
          ]]} />
        </section>

        {/* Main Articles Grid */}
        <section className="py-12 px-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-4xl border-b-4 border-brand-orange inline-block pb-2">Featured Press</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <motion.div 
                key={art.id}
                layoutId={`article-${art.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: smoothEase }}
                whileHover="hover"
                variants={{
                  hover: { y: -10, transition: { duration: 0.4, ease: smoothEase } }
                }}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-brand-border flex flex-col h-full cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/10"
                onClick={() => setSelectedArticle(art)}
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img 
                    layoutId={`article-image-${art.id}`}
                    src={art.image} 
                    className="w-full h-full object-cover origin-center" 
                    alt={art.title} 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                    variants={{
                      hover: { 
                        scale: 1.15,
                        y: 10,
                        transition: { duration: 0.6, ease: smoothEase }
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-500" />
                  <div className="absolute top-6 left-6 bg-brand-orange text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg z-20">
                    {art.source}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow relative z-10 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">{art.date}</span>
                  </div>
                  <h3 className="font-display text-2xl mb-4 group-hover:text-brand-orange transition-colors leading-tight line-clamp-2">{art.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                    {art.subtitle}
                  </p>
                  <div className="mt-auto pt-6 border-t border-brand-border/50 flex items-center justify-between">
                    <span className="text-brand-charcoal font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:text-brand-orange transition-colors">
                       Read Story <motion.div variants={{ hover: { x: 5, y: -5 } }} transition={{ duration: 0.3 }}><ArrowUpRight className="w-4 h-4 text-brand-orange" /></motion.div>
                    </span>
                  </div>
                </div>

                {/* Detailed Hover Overlay */}
                <motion.div 
                  variants={{
                    hover: { 
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: smoothEase }
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-brand-charcoal/95 p-10 flex flex-col justify-center text-center items-center pointer-events-none z-30"
                >
                  <Quote className="w-8 h-8 text-brand-orange/30 mb-6" />
                  <p className="text-white/90 text-base leading-relaxed italic mb-8 font-light line-clamp-4">
                    {art.text}
                  </p>
                  <div className="bg-brand-orange text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                    Expand Story
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>

        <AnimatePresence>
          {selectedArticle && (
            <ArticleModal 
              article={selectedArticle} 
              onClose={() => setSelectedArticle(null)} 
            />
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

const RecognitionCarousel = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % items.length);
  const prev = () => setIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative group">
      <div className="flex overflow-hidden py-4 px-4 -mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="w-full flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[0, 1, 2, 3].map((offset) => {
              const itemIndex = (index + offset) % items.length;
              const item = items[itemIndex];
              return (
                <div 
                  key={`${index}-${offset}`}
                  className={`p-6 rounded-[2rem] bg-brand-orange-light/30 backdrop-blur-md border border-white/50 h-full flex flex-col justify-between transition-all duration-500 hover:bg-brand-orange-light/50 ${
                    offset === 1 ? "hidden md:flex" : 
                    offset >= 2 ? "hidden lg:flex" : 
                    "flex"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-brand-orange" />
                      </div>
                      {item.year && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-brand-orange bg-white px-2 py-0.5 rounded-full shadow-sm">{item.year}</span>
                      )}
                    </div>
                    <h3 className="font-display text-lg text-brand-charcoal leading-tight uppercase font-black italic">{item.title}</h3>
                    <p className="text-brand-charcoal/70 text-[11px] leading-tight font-medium line-clamp-2">"{item.award}"</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 -left-2 -right-2 md:-left-4 md:-right-4 -translate-y-1/2 flex justify-between pointer-events-none">
        <button 
          onClick={prev}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-charcoal hover:bg-brand-orange hover:text-white transition-all pointer-events-auto border border-brand-border active:scale-90"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button 
          onClick={next}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-charcoal hover:bg-brand-orange hover:text-white transition-all pointer-events-auto border border-brand-border active:scale-90"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};

const ArticleModal = ({ article, onClose }: { article: any, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-charcoal/80 backdrop-blur-md"
      />
      <motion.div 
        layoutId={`article-${article.id}`}
        className="relative w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] bg-white rounded-t-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-brand-orange-light transition-colors z-20 shadow-lg border border-brand-border active:scale-95"
        >
          <X className="w-6 h-6 text-brand-charcoal" />
        </button>
        
        <div className="overflow-y-auto w-full custom-scrollbar flex-grow">
          <div className="relative aspect-video w-full overflow-hidden">
             <motion.img 
               layoutId={`article-image-${article.id}`}
               src={article.image} 
               className="w-full h-full object-cover" 
               alt={article.title} 
               referrerPolicy="no-referrer" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-brand-orange px-3 py-1 rounded-full">{article.source}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{article.date}</span>
                </div>
                <h2 className="font-display text-3xl md:text-5xl text-white leading-tight tracking-tight">{article.title}</h2>
             </div>
          </div>

          <div className="p-8 md:p-14">
            <div className="max-w-3xl mx-auto space-y-8">
              <p className="text-xl md:text-2xl text-brand-charcoal font-medium leading-relaxed italic border-l-4 border-brand-orange pl-6 py-2">
                "{article.subtitle}"
              </p>
              <div className="text-gray-600 text-lg md:text-xl leading-relaxed whitespace-pre-line font-sans prose prose-brand">
                {article.fullText || article.text}
              </div>
              
              <div className="pt-10 border-t border-brand-border/50">
                <button 
                  onClick={onClose}
                  className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-xs hover:gap-4 transition-all"
                >
                  <ArrowUpRight className="w-5 h-5 rotate-180" /> Back to Press
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


const FoundersPage: React.FC = () => {
  const founders = [
    {
      name: "Anupama Dalmia",
      role: "Co-Founder and Organiser",
      bio: "Anupama leads our strategic outreach and community building. Her multi-award winning background in service helps M4M bridge the gap between Mumbai's resourceful families and the underprivileged communities needing nutritional support.",
      image: "https://static.wixstatic.com/media/6c293b_d1bc56a8b8624128977a40b553851beb~mv2.png/v1/crop/x_1,y_20,w_1063,h_1058/fill/w_332,h_330,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screenshot%202025-01-10%20at%202_15_11%E2%80%AFPM.png",
      tag: "Impact"
    },
    {
      name: "Dev Dalmia",
      role: "Co-Founder and Junior Masterchef",
      bio: "Dev's vision for M4M was born from a passion for cooking and a deep commitment to giving. He orchestrates our city-wide food drives and restaurant collaborations, ensuring that every meal served is a masterclass in nutrition and taste.",
      image: "https://static.wixstatic.com/media/6c293b_9cdd86df173d4969bf69bfbab79fbd89~mv2.jpg/v1/crop/x_710,y_0,w_3804,h_3781/fill/w_332,h_330,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pic%203.jpg",
      linkedin: "https://www.linkedin.com/in/devdalmia/",
      tag: "Visionary"
    },
    {
      name: "Miraya Dalmia",
      role: "Co-Founder & Junior Masterchef",
      bio: "Miraya brings the 'MasterChef' magic to the streets. She experiments with global flavors—from creamy guacamole nachos to slurpy Japanese ramen—to show her 'little buddies' that food can be both nutritious and an adventurous wonder.",
      image: "https://static.wixstatic.com/media/6c293b_0bc62da668d24e1195057f0ac2295429~mv2.png/v1/crop/x_21,y_0,w_1028,h_1022/fill/w_332,h_330,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screenshot%202025-01-10%20at%202_17_12%E2%80%AFPM.png",
      tag: "Innovator"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-16 md:pb-20"
    >
      <PageHeader 
        eyebrow="Our Leadership"
        title="Meet the <br />Founders"
        subtitle="Driven by a passion for culinary excellence and a heart for service, our founders are dedicated to nourishing Mumbai's future."
        image="https://static.wixstatic.com/media/6c293b_64522503f9d14946923cde9c7ffa2141~mv2.jpg/v1/fill/w_489,h_491,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c293b_64522503f9d14946923cde9c7ffa2141~mv2.jpg"
      />

      <div className="px-6 max-w-7xl mx-auto space-y-16">
        <div className="grid md:grid-cols-3 gap-12">
          {founders.map((founder, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: smoothEase }}
              className="space-y-8 flex flex-col items-center text-center group"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
                <img 
                  src={founder.image} 
                  alt={founder.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <h3 className="font-display text-3xl md:text-4xl text-brand-charcoal">{founder.name}</h3>
                  <span className="text-brand-orange font-bold uppercase tracking-[0.2em] text-xs">
                    {founder.role}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {founder.bio}
                </p>
                {founder.linkedin && (
                  <div className="pt-4 flex justify-center">
                    <a 
                      href={founder.linkedin} 
                      target="_blank" 
                      rel="noreferrer"
                      className="border border-brand-charcoal/30 px-8 py-2 text-brand-charcoal hover:bg-brand-charcoal hover:text-white transition-all text-sm font-medium tracking-wide flex items-center gap-2"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Family Philosophy */}
        <motion.section 
          className="bg-brand-orange-light text-brand-charcoal rounded-[3rem] p-8 md:p-16 text-center space-y-10 relative overflow-hidden border border-brand-border"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(216,90,48,0.05),transparent)]" />
          <Quote className="w-16 h-16 text-brand-orange mx-auto opacity-20 relative z-10" />
          <h3 className="font-display text-4xl md:text-6xl text-brand-charcoal relative z-10 leading-tight max-w-4xl mx-auto italic tracking-tight">
            "M4M is more than a project; it's our family's promise to share the joy of food with every child in Mumbai."
          </h3>
          <div className="flex items-center justify-center gap-6 relative z-10">
            <div className="h-px w-16 bg-brand-orange/20" />
            <span className="font-bold uppercase tracking-[0.4em] text-xs text-brand-charcoal/40">
              The Dalmia Family
            </span>
            <div className="h-px w-16 bg-brand-orange/20" />
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

const PageHeader: React.FC<{ title: string; subtitle: string; eyebrow: string; image: string; className?: string }> = ({ title, subtitle, eyebrow, image, className = "" }) => {
  return (
    <section className={`relative min-h-[300px] md:min-h-[450px] flex items-center justify-center overflow-hidden mb-10 bg-brand-orange-light pt-24 md:pt-32 pb-12 md:pb-20 ${className}`}>
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt={eyebrow} 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/10 via-white/40 to-white" />
      </div>

      <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: smoothEase }}
        >
          <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-4 backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 
            className="text-4xl sm:text-5xl md:text-8xl font-display text-brand-charcoal leading-[1.1] mb-6 md:mb-8 tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-base md:text-xl text-brand-charcoal/70 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-brand-orange to-transparent opacity-30" />
      </motion.div>
    </section>
  );
};

// --- Stories of Impact Component ---

const VideoGallery = () => {
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const content = [
    {
      id: '1hDmle579EOZfao9_gh_6hnUzPF6n64UT',
      type: 'drive',
      thumbnail: "https://static.wixstatic.com/media/6c293b_617cf235aaa3449d8901e8f7d9659840~mv2.jpg/v1/fill/w_1200,h_675,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c293b_617cf235aaa3449d8901e8f7d9659840~mv2.jpg"
    },
    {
      id: '18ONB8JsgkkHYvxDxOlm6Me0uzPcz175l',
      type: 'drive',
      thumbnail: "https://static.wixstatic.com/media/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg/v1/fill/w_1200,h_675,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg"
    }
  ];

  return (
    <section id="gallery" className="py-10 md:py-12 bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          eyebrow="Moments of Impact"
          title="Our Journey in Motion"
          subtitle="Glimpses into the kitchens and communities that make MasterChef4Many possible."
          className="text-center mx-auto mb-6"
        />
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {content.map((video, idx) => (
            <motion.div 
              key={idx}
              className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl bg-brand-charcoal relative group bg-black aspect-video cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => playingIdx === null && setPlayingIdx(idx)}
            >
              {playingIdx === idx ? (
                <iframe
                  src={`https://drive.google.com/file/d/${video.id}/preview?autoplay=1`}
                  className="w-full h-full border-0"
                  allow="autoplay"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full group">
                  <img 
                    src={video.thumbnail} 
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                      <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ImpactStories = () => {
  const [index, setIndex] = useState(0);
  const stories = [
    {
      name: "Rohan",
      age: "11",
      story: "The Japanese cookout was a portal to a new world. I'd never heard of Ramen, but now it's my 'superhero fuel'. Each bite was a symphony of colors and textures. And that giant chocolate cookie? It tasted like pure happiness.",
      location: "Sewri Shelter",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
    },
    {
      name: "Priya S.",
      role: "Shelter Coordinator",
      story: "In the depth of the uncertainty, the M4M lasagna boxes were beacons of hope. They weren't just meals; they were declarations of dignity. The children learned that they are worthy of the finest flavors, even when the world is standing still.",
      location: "Matunga",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"
    },
    {
      name: "Sapna",
      role: "Parent",
      story: "We used to call it 'The Magic Box Day'. MasterChef4Many brings more than food—they bring a sense of being seen. My kids now dream of becoming chefs themselves. The quality isn't just better than movies; it feels like home.",
      location: "Sion Center",
      avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop"
    },
    {
      name: "Vikram",
      age: "9",
      story: "The Pasta Alfredo is like a creamy dream! Every time the M4M team visits, the whole center transforms into a celebration. They even knew I liked extra chocolate chips. To them, my small preferences actually matter.",
      location: "BMC School Hub",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop"
    }
  ];

  const next = () => setIndex((prev) => (prev + 1) % stories.length);
  const prev = () => setIndex((prev) => (prev - 1 + stories.length) % stories.length);

  return (
    <section className="py-24 md:py-32 border-t border-brand-border bg-brand-cream/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-orange/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeading 
          eyebrow="Soul of the Movement"
          title="Stories of Impact"
          subtitle="Beyond the numbers and statistics lie the hearts we've touched. These are the voices of the children and families that drive us forward every single day."
          className="text-center mx-auto"
        />
        
        <div className="mt-20 relative">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={index}
                className="grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: smoothEase }}
              >
                {/* Visual Part */}
                <div className="relative">
                  <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-brand-border shadow-2xl relative z-10">
                    <img 
                      src={stories[index].avatar} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                      alt={stories[index].name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8">
                      <div className="w-12 h-1 rounded-full bg-brand-orange mb-2" />
                      <p className="text-white text-lg font-display">{stories[index].name}</p>
                      <p className="text-white/60 text-xs font-sans uppercase tracking-widest">{stories[index].location}</p>
                    </div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-brand-orange/20 rounded-tl-3xl -z-10" />
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-brand-orange/20 rounded-br-3xl -z-10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 blur-3xl -z-20 rounded-full" />
                </div>

                {/* Textual Part */}
                <div className="space-y-6 md:space-y-8 text-center md:text-left">
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-brand-orange/10 mb-2">
                    <Quote className="w-6 h-6 md:w-8 md:h-8 text-brand-orange" />
                  </div>
                  <motion.p 
                    className="text-xl sm:text-2xl md:text-4xl font-sans font-medium text-brand-charcoal !leading-[1.45] tracking-tight italic"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    "{stories[index].story}"
                  </motion.p>
                  <div className="space-y-1 pt-4 md:pt-6">
                    <p className="font-display text-xl md:text-2xl text-brand-charcoal">
                      {stories[index].name}{stories[index].age ? `, ${stories[index].age}` : ''}
                    </p>
                    <div className="flex items-center justify-center md:items-start md:justify-start gap-3">
                      <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-orange font-sans">{stories[index].location}</span>
                      {stories[index].role && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal/20" />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal/40 font-sans">{stories[index].role}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-16 md:mt-24">
            <button 
              onClick={prev}
              className="w-14 h-14 rounded-full border border-brand-border flex items-center justify-center text-brand-charcoal hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all cursor-pointer shadow-sm bg-white active:scale-95 translate-y-1 hover:-translate-y-1"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${i === index ? 'w-12 bg-brand-orange' : 'w-3 bg-brand-charcoal/10 hover:bg-brand-charcoal/20'}`} 
                />
              ))}
            </div>
            <button 
              onClick={next}
              className="w-14 h-14 rounded-full border border-brand-border flex items-center justify-center text-brand-charcoal hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all cursor-pointer shadow-sm bg-white active:scale-95 translate-y-1 hover:-translate-y-1"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const CookoutsPage: React.FC = () => {
  const [selectedCook, setSelectedCook] = useState<any>(null);

  const cooks = [
    {
      id: "Cook #1",
      date: "20-22 November 2018",
      event: "The Nutcracker x Angel Xpress",
      description: "When The Nutcracker opened its professional kitchen, the air filled with the scent of roasted corn and molten chocolate. Founder Annie guided us as we prepared a feast for the children of Cuffe Parade.",
      fullDescription: "When The Nutcracker opened its professional kitchen, the air filled with the scent of roasted corn and molten chocolate. Founder Annie guided us as we prepared a feast for the children of Cuffe Parade. It was exhilarating to chat about food with these kids—many of whom had watched Masterchef—and watch them enjoy the food we brought them! 74 kids, many cookies and empty pasta bowls later, we don't know who felt happier.",
      image: "https://static.wixstatic.com/media/6c293b_64522503f9d14946923cde9c7ffa2141~mv2.jpg",
      menu: "Cheese and Corn Croquettes, Penne Arrabiata, Chocolate Shortbread Cookies",
      stats: ["74 Children", "Cuffe Parade"],
      impact: "74 joyful smiles and a legacy born"
    },
    {
      id: "Cook #2",
      date: "26-28 December 2018",
      event: "El Mercado x Mumbai Smiles",
      description: "Spanish aromas took over Saki Naka. At El Mercado, we collaborated with Vidur Kapoor to craft a traditional Spanish feast.",
      fullDescription: "Spanish aromas took over Saki Naka. At El Mercado, we collaborated with Vidur Kapoor to craft a traditional Spanish feast. We discovered the vibrant aspirations of the young girls there—singers, doctors, and even chefs! It was delightful seeing the girls enjoying themselves so much, learning how each of them into unique and amazing dreams.",
      image: "https://static.wixstatic.com/media/6c293b_4fee6d985c514d8bb6787cf3c18475d6~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_4fee6d985c514d8bb6787cf3c18475d6~mv2.jpeg",
      menu: "Spanish Tortillas, Paella, Arroz con Leche",
      stats: ["110 Students", "Saki Naka"],
      impact: "Empowering dreams through culinary curiosity"
    },
    {
      id: "Cook #3",
      date: "15-17 May 2019",
      event: "Tertulia x Prabhadevi Hub",
      description: "Our third cookout at Tertulia was a family affair. Alongside Imrun Sethi, we prepared soulful Spaghetti Aglio Olio.",
      fullDescription: "Our third cookout at Tertulia was a family affair. Alongside Imrun Sethi, we prepared soulful Spaghetti Aglio Olio. Meeting Anju, a young girl whose resilience outshone her growth disorder, was a humbling lesson. All the children took great care of her; it almost brought tears to our eyes to think that someone can be so happy with so little.",
      image: "https://static.wixstatic.com/media/6c293b_ac09700dba434696b355a357a5a38101~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_ac09700dba434696b355a357a5a38101~mv2.jpg",
      menu: "Spaghetti Aglio Olio with Chicken, Gooey Chocolate Cake",
      stats: ["85 Beneficiaries", "Prabhadevi"],
      impact: "Lessons in gratitude across every table"
    },
    {
      id: "Cook #4",
      date: "12-14 September 2019",
      event: "The Clearing House x St. Catherine's",
      description: "Chef Rishim Sachdeva hosted us for a session focused on empowerment and premium flavors.",
      fullDescription: "Chef Rishim Sachdeva hosted us for a session focused on empowerment. Cooking for the girls of St. Catherine's Home taught us that every child deserves to be treated like a 'MasterChef'. Serving world-class cuisine in a professional setting bridged the gap between 'them' and 'us'.",
      image: "https://static.wixstatic.com/media/6c293b_1d73f1b6a8574ac7a2b11c529f98f823~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_1d73f1b6a8574ac7a2b11c529f98f823~mv2.jpeg",
      menu: "Mini Veggie Tacos, Roasted Corn on the Cob, Cinnamon Churros",
      stats: ["120 Girls", "Andheri"],
      impact: "Premium flavors for powerful futures"
    },
    {
      id: "Cook #5",
      date: "October 2019",
      event: "Woodside Inn x Colaba Cluster",
      description: "Partnering with Woodside Inn, we brought a taste of gourmet bistro food to children from Colaba.",
      fullDescription: "Partnering with Woodside Inn, we brought a taste of gourmet bistro food to children from the Colaba slum clusters. The highlight was crafting balanced, healthy mini-burgers that the kids couldn't get enough of. It proved that nutritious food can be incredibly delicious.",
      image: "https://static.wixstatic.com/media/6c293b_915f1613b8574236b84b9f4efc5403bf~mv2.jpg",
      menu: "Veggie Sliders, Sweet Potato Fries, Fresh Lemonade",
      stats: ["95 Kids", "Colaba"],
      impact: "Redefining street food through nutrition"
    },
    {
      id: "Cook #6",
      date: "January 2020",
      event: "The Table x Byculla Outreach",
      description: "Just before the lockdown, we worked with Chef Alex Sanchez at The Table to create a farm-to-table experience.",
      fullDescription: "Just before the lockdown, we worked with Chef Alex Sanchez at The Table to create a farm-to-table experience. Children visited the kitchen and saw how fresh produce transforms into culinary art. It was an educational journey as much as a meal.",
      image: "https://static.wixstatic.com/media/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg/v1/fill/w_1200,h_675,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg",
      menu: "Zucchini Carpaccio, Wild Mushroom Risotto, Fresh Sorbet",
      stats: ["60 Students", "Byculla"],
      impact: "Farm-to-table education for all"
    },
    {
      id: "Cook #7",
      date: "August 2020",
      event: "The Decentralized Kitchen",
      description: "When the pandemic closed restaurant doors, 200 Mumbai families opened theirs for The Good Food Drive.",
      fullDescription: "When the pandemic closed restaurant doors, 200 Mumbai families opened theirs. 'The Good Food Drive' proved that a city's heartbeat is found in its home kitchens. By preparing gourmet burgers and lasagna from their own tiffins, our community ensured that isolation didn't mean hunger.",
      image: "https://static.wixstatic.com/media/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg",
      menu: "Vegetarian Lasagna, Herbed Garlic Bread, Chunky Cookies",
      stats: ["135000+ Meals", "City-Wide"],
      impact: "135,000+ meals served in isolation"
    }
  ];

  const galleryImages = [
    "https://static.wixstatic.com/media/6c293b_617cf235aaa3449d8901e8f7d9659840~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_7c64f45154ea490786ef558071923e65~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_9b4bfa6570754c12ae7cc700d3061642~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_f95b9140745d4c7ab8073dc04e4cc933~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_2a57b057a7934a5bbcb2b59cd43312a3~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_05c32c92463e4541813c709c0c1e1e0c~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_cb7fb7fdd0a243818bcee9592076292d~mv2.jpeg",
    "https://static.wixstatic.com/media/6c293b_a0e48698aab04e5d968997b931b38033~mv2.jpg",
    "https://static.wixstatic.com/media/6c293b_915f1613b8574236b84b9f4efc5403bf~mv2.jpg"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-16 md:pb-20"
    >
      <PageHeader 
        eyebrow="Special Initiatives"
        title="Restaurant <br />Cookouts"
        subtitle="Bridging the gap between fine-dining kitchens and the children who dream of them."
        image="https://static.wixstatic.com/media/11062b_2a31026fd9834b12aecf8f32823c7ead~mv2.jpeg/v1/fill/w_1898,h_401,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_2a31026fd9834b12aecf8f32823c7ead~mv2.jpeg"
        className="mb-0"
      />

      <div className="px-6 max-w-7xl mx-auto space-y-16 mt-12 md:mt-24 relative">
        {/* Decorative Culinary Background Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none -z-10 overflow-hidden">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-20 transform -rotate-12 translate-x-20">
            {Array.from({ length: 24 }).map((_, i) => (
              <ChefHat key={i} className="w-16 h-16" />
            ))}
          </div>
        </div>

        <section className="bg-brand-orange/5 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-brand-orange/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.07] group-hover:scale-110 transition-transform duration-1000 hidden md:block">
            <ChefHat className="w-48 h-48 text-brand-orange" />
          </div>
          <div className="max-w-3xl relative z-10 transition-transform group-hover:translate-x-2 duration-700">
            <SectionHeading 
              eyebrow="The Idea"
              title="A thousand possibilities, a hundred smiles"
              subtitle="The idea of M4M is to share our love for food meaningfully with other children who are not as fortunate as us. Moreover, M4M is about introducing the common people to some delicious but new-age food with new-age ingredients - the MasterChef way!"
            />
            <div className="space-y-6 text-gray-600 leading-relaxed italic mt-4">
              <p>
                "I’m buzzing with excitement to see how nachos with creamy guacamole will crunch in their mouths and hopefully dazzle them with wonder. Or a black bean burger is interpreted by them as 'Arre, rajmawala vada pav hain!'."
              </p>
              <p>
                "I’m drooling with the idea of making a slurrrrrpy noodle ramen recipe from Japan! A thousand possibilities, a hundred smiles and just a few simple but amazing recipes."
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl">
          <SectionHeading 
            eyebrow="What We Do"
            title="The Cookout Model"
            subtitle="M4M introduces underprivileged children to world-class cuisine through strategic partnerships with Mumbai's leading restaurateurs."
          />
          <div className="grid sm:grid-cols-3 gap-8 pt-4">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <ChefHat className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl">Restaurant Partnership</h4>
              <p className="text-sm text-gray-500 leading-relaxed">We partner with some of Mumbai's most iconic eateries to use their professional facilities.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Utensils className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl">Kitchen Prep</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Founders and volunteers cook alongside professional chefs to ensure the highest standards.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-display text-xl">Community Feeding</h4>
              <p className="text-sm text-gray-500 leading-relaxed">The gourmet meals are then distributed to orphanages, schools, or slum clusters.</p>
            </div>
          </div>
        </section>

        <section className="bg-brand-charcoal py-16 px-8 rounded-[3rem] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-orange/5" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-3xl md:text-4xl text-white leading-tight">We're Restarting the Cookouts!</h2>
            <p className="text-white/60 text-base">Restauranteurs, we invite you to join Mumbai's largest youth-led culinary movement. Reach out to collaborate.</p>
            <div className="pt-2">
              <a 
                href="mailto:masterchef4many@gmail.com"
                className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-brand-orange transition-all shadow-lg shadow-brand-orange/20"
              >
                <Mail className="w-4 h-4" /> Email Us
              </a>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <SectionHeading 
              eyebrow="Timeline"
              title="Restaurant Cookouts"
              subtitle="Glimpses into the projects that started it all — from fine-dining kitchens to community smiles."
              className="mb-0"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cooks.map((cook, idx) => (
              <motion.div
                key={cook.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedCook(cook)}
                className="group cursor-pointer bg-white rounded-[2.5rem] border border-brand-border overflow-hidden hover:shadow-2xl hover:border-brand-orange/30 transition-all duration-700 flex flex-col relative"
                whileHover={{ y: -8 }}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <motion.img 
                    src={cook.image} 
                    alt={cook.event} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer"
                    whileHover={{ scale: 1.12, rotate: -1, x: -5, y: -5 }}
                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                  />
                  <div className="absolute inset-0 bg-brand-charcoal/10 group-hover:bg-transparent transition-colors duration-700" />
                  
                  <motion.div 
                    className="absolute top-4 left-4 z-10"
                    whileHover={{ y: -2, x: -2 }}
                  >
                    <span className="px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange border border-brand-orange/10 shadow-sm">
                      {cook.id}
                    </span>
                  </motion.div>
                </div>

                <div className="p-8 flex-grow space-y-4 bg-gradient-to-b from-white to-brand-cream/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40 font-sans">
                    <Calendar className="w-3 h-3 text-brand-orange/60" /> {cook.date}
                  </div>
                  <h3 className="font-display text-2xl text-brand-charcoal group-hover:text-brand-orange transition-colors duration-500">{cook.event}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed font-sans">{cook.description}</p>
                  
                  <div className="pt-4 flex items-center gap-2 text-brand-orange font-bold text-[10px] uppercase tracking-[0.2em] transform translate-x-0 group-hover:translate-x-2 transition-transform duration-500">
                    View Impact <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Modal / Expansion */}
        <AnimatePresence>
          {selectedCook && (
            <motion.div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="absolute inset-0 bg-brand-charcoal/90 backdrop-blur-md"
                onClick={() => setSelectedCook(null)}
              />
              <motion.div 
                className="bg-white w-full max-w-5xl rounded-[2rem] md:rounded-[3rem] overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh]"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <button 
                  onClick={() => setSelectedCook(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/20 hover:bg-brand-orange text-white rounded-full flex items-center justify-center transition-colors z-20 backdrop-blur-md"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="md:w-1/2 relative min-h-[200px] md:min-h-[300px] shrink-0">
                  <img src={selectedCook.image} className="w-full h-full object-cover" alt={selectedCook.event} referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 p-0">
                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-brand-orange text-white rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                      {selectedCook.id}
                    </span>
                  </div>
                </div>

                <div className="md:w-1/2 p-6 md:p-12 overflow-y-auto space-y-6 md:space-y-8 bg-brand-cream/10">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 text-brand-orange font-bold text-[10px] md:text-sm uppercase tracking-widest font-sans">
                      <Calendar className="w-4 h-4" /> {selectedCook.date}
                    </div>
                    <h2 className="font-display text-2xl md:text-4xl text-brand-charcoal">{selectedCook.event}</h2>
                  </div>

                  <div className="space-y-5 md:space-y-6">
                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">{selectedCook.fullDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {selectedCook.stats.map((stat: string, i: number) => (
                        <div key={i} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-brand-border flex items-center gap-2 md:gap-3">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                            {i === 0 ? <Users className="w-3 h-3 md:w-4 md:h-4" /> : <MapPin className="w-3 h-3 md:w-4 md:h-4" />}
                          </div>
                          <span className="text-[9px] md:text-sm font-bold text-brand-charcoal uppercase tracking-widest leading-none">{stat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-brand-orange/5 border border-brand-orange/10 space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2 text-brand-orange">
                        <Utensils className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">The MasterChef Menu</span>
                      </div>
                      <p className="text-brand-charcoal font-medium text-sm md:text-base">{selectedCook.menu}</p>
                    </div>

                    <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-emerald-50 border border-emerald-100 space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">The Impact</span>
                      </div>
                      <p className="text-emerald-800 font-medium italic opacity-80 text-sm md:text-base">"{selectedCook.impact}"</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-10">
          <SectionHeading 
            eyebrow="Our Network"
            title="Restaurant Partners"
            subtitle="The professional kitchens that have opened their doors to the M4M movement."
          />
          <div className="flex flex-wrap gap-3">
            {[
              "The Nutcracker", "El Mercado", "The Table", "Tertulia", 
              "Woodside Inn", "The Clearing House", "Sequel", "Mag St. Kitchen",
              "Masala Library", "Farzi Cafe", "Pa Pa Ya", "Kala Ghoda Cafe"
            ].map((partner, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 rounded-xl border border-brand-border font-display text-lg text-brand-charcoal hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all duration-300 cursor-default"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-brand-charcoal text-white rounded-[3rem] p-8 md:p-16 text-center space-y-10">
          <div className="space-y-6">
            <h3 className="font-display text-3xl md:text-5xl max-w-2xl mx-auto leading-tight">Want to help us grow our impact?</h3>
            <p className="text-white/60 text-lg max-w-xl mx-auto">We're looking for partners, restaurateurs, and volunteers who want to change how Mumbai thinks about food and charity.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={() => window.location.href = 'mailto:masterchef4many@gmail.com?subject=I want to help'}
              className="h-14 px-8 text-base rounded-full"
              variant="white"
            >
              Reach Out via Email <Mail className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              onClick={() => window.open('https://wa.me/919820167166', '_blank')}
              className="h-14 px-8 text-base bg-emerald-600 text-white hover:bg-emerald-700 border-none rounded-full"
            >
              WhatsApp Us <Phone className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const StoryPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-16 md:pb-20"
    >
      <PageHeader 
        eyebrow="Our Legacy"
        title="From a Single Kitchen <br />to a Soulful Movement"
        subtitle="What began as a simple family promise has blossomed into Mumbai's largest youth-led culinary force. We share our love for food meaningfully by introducing children to new-age gourmet flavors—the MasterChef way!"
        image="https://static.wixstatic.com/media/11062b_cacb6249b6024b61b2d8a8594b7dbb4c~mv2.jpg"
        className="!mb-0"
      />

      <div className="px-6 max-w-7xl mx-auto">
        {/* Vision & Journey Carousel */}
        <div className="-mx-6 mb-16">
          <VisionCarousel className="!mt-0 !rounded-t-none" />
        </div>

      {/* Timeline Section */}
      <section className="space-y-8">
        <SectionHeading 
          eyebrow="Our Journey"
          title="From a single kitchen to a city-wide movement"
          subtitle="Every meal served tells a story of compassion, resilience, and the power of youth to drive change."
        />

        <div className="relative mt-12 px-4 md:px-0 mb-20">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-orange/20 hidden md:block" />
          
          <div className="space-y-12">
            {[
              {
                year: "New Years Eve 2017",
                title: "The Spark of Cosmic Flavor",
                description: "On a night of celebration, a question whispered: why is gourmet joy a luxury? We served our first Al-Dente Pasta and velvet chocolate cookies to the children of Angel Xpress. We were buzzing with excitement to see how nachos with creamy guacamole would crunch and dazzle them with wonder.",
                icon: <ChefHat className="w-5 h-5" />,
                align: "right"
              },
              {
                year: "May 17, 2020",
                title: "Feeding the Lockdown silence",
                description: "As Mumbai fell silent, hunger roared. From a single home kitchen, the first 19 khichdi meals were packed with hope. We realized that in a crisis, the dignity of a warm, delicious meal is the ultimate message of resilience.",
                icon: <Target className="w-5 h-5" />,
                align: "left"
              },
              {
                year: "June 2020",
                title: "The Student Army Rises",
                description: "One kitchen became hundreds. Diya Bhageria and Tanisha Laud mobilized a movement. 300+ students turned their homes into 'Joy Hubs', proving that youth-led compassion could scale faster than any crisis.",
                icon: <Users className="w-5 h-5" />,
                align: "right"
              },
              {
                year: "End of 2020",
                title: "The 135k Milestone",
                description: "135,000 plates of gourmet joy. 135,000 moments where a child discovered that pasta, burgers, and hand-crafted cookies weren't just for billboards—they were for them. A city was transformed through the language of food.",
                icon: <Quote className="w-5 h-5" />,
                align: "left"
              },
              {
                year: "Sept 2024",
                title: "Evolution to Sustenance",
                description: "Miraya Dalmia launched the Orphanage Nutrition Project (ONP). We shifted from sporadic treats to structured, daily high-protein fuel. Because healthy bodies are the foundation of big dreams.",
                icon: <Heart className="w-5 h-5" />,
                align: "right"
              },
              {
                year: "2025 & Beyond",
                title: "Two Paths, One Mission",
                description: "Today, M4M thrives through two parallel paths: citywide Good Food Drives and monthly restaurant cookouts. From 'slurrrrpy' Japanese ramen to high-protein daily lunches, we nourish 500+ souls daily, proving that compassion is Mumbai's secret ingredient.",
                icon: <CheckCircle className="w-5 h-5" />,
                align: "left"
              }
            ].map((milestone, idx) => (
              <motion.div 
                key={idx}
                className={`flex flex-col md:flex-row items-center gap-12 ${milestone.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              >
                <div className={`flex-1 w-full text-center ${milestone.align === 'right' ? 'md:text-left' : 'md:text-right'}`}>
                  <div className="space-y-3">
                    <span className="text-brand-orange font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">{milestone.year}</span>
                    <h3 className="font-display text-xl md:text-3xl text-brand-charcoal">{milestone.title}</h3>
                    <p className={`text-gray-500 text-xs md:text-base leading-relaxed max-w-sm mx-auto inline-block ${milestone.align === 'right' ? 'md:ml-0 md:mr-auto' : 'md:mr-0 md:ml-auto'}`}>
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-orange flex items-center justify-center text-white border-4 border-brand-cream shadow-xl shrink-0">
                  {milestone.icon}
                </div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>

      {/* Detailed Work Carousel (Reworked Section) */}
        <section className="pt-16 pb-12 space-y-10">
          <SectionHeading 
            eyebrow="Detailed Portfolios"
            title="A deeper look into our cookouts"
            subtitle="Explore the menus and stories behind our most impactful food security initiatives."
          />
          <WorkCarousel 
            type="summary"
            items={[
              {
                title: "The Lockdown Lasagna Collective",
                period: "Crisis Response 2020",
                description: "We challenged the notion that charity should only be basic. We asked: 'What would we crave?' The answer was bubbling, golden-crust lasagna. Over 100 families turned their home kitchens into gourmet labs, delivering warmth and dignity in every box. This project redefined our scale and proved that compassion is the most essential ingredient.",
                image: "https://static.wixstatic.com/media/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_a9dc4fd93a0e4ffea4ff38fd24f949ad~mv2.jpeg",
                menu: "Bolognese Lasagna, Herbed Garlic Focaccia, Artisanal Burgers",
                impact: "Decentralized nutrition for 200+ areas",
                stats: ["200+ Families", "135k Meals"]
              },
              {
                title: "The Signature Cookie Project",
                period: "Ongoing Sweetness",
                description: "Sweetness is a necessity for the soul. Our Signature Cookie Project ensures that every child experiences the simple, unadulterated joy of a hand-baked treat. Our network of young patissiers crafts thousands of chunky, premium chocolate chip cookies monthly, bridging the gap between subsistence and soul-satisfaction.",
                image: "https://static.wixstatic.com/media/6c293b_4fee6d985c514d8bb6787cf3c18475d6~mv2.jpeg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_4fee6d985c514d8bb6787cf3c18475d6~mv2.jpeg",
                menu: "Sea Salt Dark Choc, Classic Milk Chocolate, White Choc Macadamia",
                impact: "Monthly smiles across 30+ shelters",
                stats: ["5000+ Cookies/mo", "Youth Led"]
              },
              {
                title: "Daily Nutrition Bridge (CNP)",
                period: "Foundational Care",
                description: "The evolution of our mission toward long-term systemic impact. Through the Orphanage Nutrition Project, we sustain 500+ daily beneficiaries with scientific, protein-rich lunches. By empowering local caterers, we've built a sustainable pipeline that ensures hunger is permanently off the menu for the children in our care.",
                image: "https://static.wixstatic.com/media/6c293b_a0e48698aab04e5d968997b931b38033~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_a0e48698aab04e5d968997b931b38033~mv2.jpg",
                menu: "High-Protein Lenthils, Fresh Green Greens, Seasonal Fruit Medleys",
                impact: "Structural health for 17+ orphanages",
                stats: ["500+ Daily", "17+ Locations"]
              }
            ]}
          />
        </section>
      </section>

      <ImpactStories />
      </div>
    </motion.div>
  );
};

const InvolvedPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: smoothEase }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pb-16 md:pb-20"
    >
      <PageHeader 
        eyebrow="Get Involved"
        title="Three Ways <br />You Can Help"
        subtitle="There are three ways to be part of MasterChef4Many. Every one of them changes a life."
        image="https://static.wixstatic.com/media/6c293b_2a57b057a7934a5bbcb2b59cd43312a3~mv2.jpg/v1/fill/w_426,h_426,q_90,enc_avif,quality_auto/6c293b_2a57b057a7934a5bbcb2b59cd43312a3~mv2.jpg"
      />

      <div className="px-6 max-w-7xl mx-auto space-y-16">
        <motion.div 
          className="grid md:grid-cols-3 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
        {[
          { label: "01", title: "Donate a Meal", text: "Your contribution sponsors nutritious meals. Every rupee goes directly to feeding children.", btn: "Donate Now", variant: "primary", action: () => window.open('https://pages.razorpay.com/masterchef4many', '_blank') },
          { label: "02", title: "Cook with Us", text: "Cook at home and we'll collect from Cuffe Parade to Worli every weekend.", btn: "Join Weekend Network", icon: <Mail className="w-4 h-4" />, variant: "outline", action: () => { window.location.href = 'mailto:masterchef4many@gmail.com?subject=Joining Weekend Network'; } },
          { label: "03", title: "Spread the Word", text: "Follow our journey, share our stories, and help us grow our family.", btn: "@masterchef4many", icon: <Instagram className="w-4 h-4" />, variant: "outline", action: () => window.open('https://www.instagram.com/masterchef4many/', '_blank') }
        ].map((item, i) => (
          <motion.div key={i} className="space-y-6" variants={itemVariants}>
            <div className="font-display text-6xl text-brand-orange/20">{item.label}</div>
            <h3 className="font-display text-3xl">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
            <Button 
              variant={item.variant as any} 
              className="w-full justify-center"
              onClick={item.action}
            >
              {item.icon} {item.btn}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <motion.section 
        className="bg-brand-charcoal text-white rounded-3xl pt-16 pb-12 px-6 sm:px-10 md:px-12"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-4xl md:text-5xl">Let's connect</h2>
            <div className="space-y-6 overflow-hidden">
              <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-transform">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold">Email</div>
                  <div className="text-sm sm:text-lg break-all sm:truncate">masterchef4many@gmail.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-transform" onClick={() => window.open('https://wa.me/919820167166', '_blank')}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600/10 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold">WhatsApp</div>
                  <div className="text-sm sm:text-lg">+91 98201 67166</div>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer hover:translate-x-2 transition-transform" onClick={() => window.open('https://www.instagram.com/masterchef4many/', '_blank')}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest font-bold">Instagram</div>
                  <div className="text-sm sm:text-lg">@masterchef4many</div>
                </div>
              </div>
            </div>
          </div>
          <motion.div 
            className="aspect-square lg:aspect-auto bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-6 sm:p-12 text-center"
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="space-y-6">
              <Target className="w-10 h-10 md:w-16 md:h-16 text-brand-orange mx-auto" />
              <h3 className="font-display text-2xl md:text-3xl">Corporate Sponsorship</h3>
              <p className="text-white/60 text-sm md:text-base leading-relaxed">Interested in sponsoring a full day of the Children Nutrition Project? We provide nutritious meals to 500 children daily.</p>
              <Button onClick={() => window.location.href = 'mailto:masterchef4many@gmail.com?subject=Corporate Sponsorship Inquiry'} variant="white" className="mx-auto cursor-pointer">Contact Us to Partner</Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 4 — Meal sponsorship explanation */}
      <motion.section 
        className="bg-brand-orange-light p-6 md:p-10 rounded-3xl border border-brand-orange/20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <Heart className="w-12 h-12 text-brand-orange mx-auto" />
          <h2 className="font-display text-3xl md:text-4xl text-brand-charcoal">Understanding Meal Sponsorship</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg text-left">
            <p>
              Every donation to MasterChef4Many is tracked directly to meal procurement and distribution. 
              Our <strong>Razorpay integration</strong> ensures a secure and frictionless donation process, 
              allowing us to focus on what matters most: quality nutrition.
            </p>
            <p>
              <strong>Corporate & Group Sponsors:</strong> You can sponsor a <em>Full CNP Day</em> which provides 
              500 children with a complete nutritious lunch plus seasonal fruits. Sponsors receive a summary report 
              of the impact made that day.
            </p>
            <p>
              <strong>Home Cooks:</strong> Beyond financial contributions, our weekend pickup network is the backbone 
              of our community reach. By cooking at home, you provide the personal touch of a parent’s tiffin 
              to children in the neediest areas of Mumbai.
            </p>
          </div>
        </div>
      </motion.section>
      </div>
    </motion.div>
  );
};

const WorkCarousel: React.FC<{ items: any[]; type: 'cookout' | 'drive' | 'summary' }> = ({ items, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative group px-4 md:px-0">
      <div className="overflow-hidden rounded-3xl md:rounded-[3rem] shadow-2xl bg-white border border-brand-border">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: smoothEase }}
            className="grid lg:grid-cols-2 min-h-[400px]"
          >
            <div className="relative aspect-video lg:aspect-auto overflow-hidden">
              <img 
                src={items[currentIndex].image} 
                alt={items[currentIndex].title || items[currentIndex].location || items[currentIndex].event} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div className="p-6 md:p-16 flex flex-col justify-center space-y-6 md:space-y-8">
              <div>
                <span className="text-brand-orange font-bold text-[10px] md:text-xs uppercase tracking-widest block mb-2 md:mb-4">
                  {items[currentIndex].date || items[currentIndex].year || items[currentIndex].note || items[currentIndex].period}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl md:text-5xl leading-tight mb-2 md:mb-4">
                  {items[currentIndex].title || items[currentIndex].location || items[currentIndex].event}
                </h3>
                {items[currentIndex].ngo && (
                  <h4 className="text-brand-charcoal/60 font-semibold mb-2 md:mb-4 italic text-sm md:text-base">Partner: {items[currentIndex].ngo}</h4>
                )}
              </div>
              
              <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                {items[currentIndex].description}
              </p>

              {items[currentIndex].stats && (
                <div className="flex gap-4 md:gap-8 border-t border-brand-border pt-6 md:pt-8">
                  {items[currentIndex].stats.map((s: string, idx: number) => (
                    <div key={idx} className="space-y-0.5 md:space-y-1">
                      <div className="font-display text-lg md:text-2xl font-bold text-brand-charcoal">{s.split(' ')[0]}</div>
                      <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/40">{s.split(' ').slice(1).join(' ')}</div>
                    </div>
                  ))}
                </div>
              )}

              {items[currentIndex].menu && (
                <div className="bg-brand-cream border border-brand-orange/20 p-4 md:p-6 rounded-xl md:rounded-2xl">
                  <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-1 md:mb-2">Menu Served</div>
                  <p className="text-brand-charcoal font-medium text-xs md:text-sm">{items[currentIndex].menu}</p>
                </div>
              )}

              {items[currentIndex].impact && (
                <div className="inline-flex items-center gap-2 text-brand-orange font-bold text-[10px] md:text-xs uppercase tracking-widest border border-brand-orange/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full w-fit">
                  <Target className="w-3 h-3 md:w-4 md:h-4" /> {items[currentIndex].impact}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-6 lg:-left-10 z-10">
        <button 
          onClick={prev}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl border border-brand-border flex items-center justify-center text-brand-charcoal hover:bg-brand-orange hover:text-white transition-all cursor-pointer bg-opacity-80 md:bg-opacity-100"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 rotate-180" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-6 lg:-right-10 z-10">
        <button 
          onClick={next}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-xl border border-brand-border flex items-center justify-center text-brand-charcoal hover:bg-brand-orange hover:text-white transition-all cursor-pointer bg-opacity-80 md:bg-opacity-100"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
      
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-brand-orange' : 'w-2 bg-brand-charcoal/10'}`}
          />
        ))}
      </div>
    </div>

  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
    };

    scrollToTop();
    
    // Deeper fallback for slow page transitions/DOM updates
    const timers = [10, 50, 100, 300, 500].map(delay => 
      setTimeout(scrollToTop, delay)
    );
    
    return () => timers.forEach(clearTimeout);
  }, [page]);



  const [isExploreDropdownOpen, setIsExploreDropdownOpen] = useState(false);

  const navLinks: { label: string; id: Page }[] = [
    { label: 'Home', id: 'home' },
    { label: 'Our Story', id: 'story' },
    { label: 'Cookouts', id: 'cookouts' },
    { label: 'Founders', id: 'founders' },
    { label: 'Press', id: 'press' },
    { label: 'Get Involved', id: 'involved' },
  ];

  const handleNav = (p: Page) => {
    setPage(p);
    setMobileMenuOpen(false);
    setIsExploreDropdownOpen(false);
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-white selection:bg-brand-orange/10 selection:text-brand-orange overflow-x-hidden">
      <ScrollProgressBar page={page} />
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 flex justify-center ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl py-2 shadow-sm border-b border-brand-border/10" 
            : "bg-brand-orange-light py-2 md:py-5"
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-7xl px-4 md:px-10">
          <div 
            onClick={() => handleNav('home')} 
            className="flex items-center cursor-pointer group"
          >
            <Logo />
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <div className="flex items-center bg-brand-charcoal/5 rounded-full px-1.5 py-1 mr-3 border border-brand-charcoal/5">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-3.5 py-1.5 text-[12px] font-sans font-bold tracking-tight transition-all rounded-full cursor-pointer relative ${
                    page === link.id ? 'text-brand-orange bg-white shadow-sm' : 'text-brand-charcoal/60 hover:text-brand-charcoal'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => window.open('https://pages.razorpay.com/masterchef4many', '_blank')}
              className="px-6 py-2.5 bg-brand-orange text-white text-[10px] font-sans font-bold tracking-[0.2em] uppercase hover:bg-brand-charcoal transition-all shadow-lg shadow-brand-orange/20 active:scale-95 rounded-xl"
            >
              Support Us
            </button>
          </div>

          <button 
            className={`lg:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              scrolled ? 'bg-brand-charcoal text-white shadow-md' : 'bg-white text-brand-charcoal border border-brand-border/10'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200]"
          >
            <motion.div 
              className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-md"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-[85%] sm:w-[420px] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-4 md:p-8 border-b border-brand-border/10">
                <Logo />
                <button 
                   onClick={() => setMobileMenuOpen(false)}
                   className="w-9 h-9 rounded-xl bg-brand-charcoal text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-charcoal/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-start p-5 md:p-14 gap-5 overflow-y-auto">
                <div className="space-y-2">
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link, i) => (
                      <motion.button 
                        key={link.id}
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        onClick={() => handleNav(link.id)}
                        className={`group flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all ${
                          page === link.id 
                            ? 'bg-brand-orange/5 text-brand-orange shadow-sm' 
                            : 'text-brand-charcoal/70 hover:bg-brand-charcoal/5 hover:text-brand-charcoal'
                        }`}
                      >
                        <span className="font-display text-lg tracking-tight">{link.label}</span>
                        <ArrowUpRight className={`w-4 h-4 transition-all duration-500 ${
                          page === link.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1'
                        }`} />
                      </motion.button>
                    ))}
                  </nav>
                </div>
                
                <div className="mt-auto space-y-6">
                  <div className="p-5 rounded-[1.5rem] bg-brand-orange-light/40 border border-brand-orange/10 space-y-4 relative overflow-hidden group">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    <div className="space-y-1.5 relative z-10">
                      <h4 className="font-display text-lg text-brand-charcoal">Support Our Mission</h4>
                      <p className="text-[12px] text-brand-charcoal/60 leading-relaxed font-sans">Help us reach more children with quality meals.</p>
                    </div>
                    <button 
                      onClick={() => window.open('https://pages.razorpay.com/masterchef4many', '_blank')}
                      className="w-full py-3.5 bg-brand-orange text-white text-[10px] font-sans font-bold tracking-[0.2em] uppercase rounded-xl shadow-xl shadow-brand-orange/20 hover:bg-brand-charcoal transition-all active:scale-[0.98]"
                    >
                      Donate Now
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 pb-1">
                    <motion.a whileHover={{ y: -4, scale: 1.1 }} href="https://instagram.com/masterchef4many" target="_blank" className="p-2.5 rounded-xl bg-brand-charcoal/5 text-brand-charcoal hover:bg-brand-orange hover:text-white transition-all"><Instagram className="w-5 h-5" /></motion.a>
                    <motion.a whileHover={{ y: -4, scale: 1.1 }} href="mailto:masterchef4many@gmail.com" className="p-2.5 rounded-xl bg-brand-charcoal/5 text-brand-charcoal hover:bg-brand-orange hover:text-white transition-all"><Mail className="w-5 h-5" /></motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <main>
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" setPage={handleNav} />}
          {page === 'story' && <StoryPage key="story" />}
          {page === 'cookouts' && <CookoutsPage key="cookouts" />}
          {page === 'press' && <PressPage key="press" />}
          {page === 'involved' && <InvolvedPage key="involved" />}
          {page === 'founders' && <FoundersPage key="founders" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-brand-cream text-brand-charcoal pt-10 pb-6 px-6 border-t border-brand-border">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="space-y-8">
              <Logo variant="dark" />
              <p className="text-brand-charcoal/60 text-base leading-relaxed max-w-sm">
                A youth-led movement transforming hunger into hope through delicious, gourmet-quality meals for children across Mumbai.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/masterchef4many/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-brand-orange-light flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-all cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="mailto:masterchef4many@gmail.com" className="w-12 h-12 rounded-xl bg-brand-orange-light flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-all cursor-pointer">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="tel:+919820167166" className="w-12 h-12 rounded-xl bg-brand-orange-light flex items-center justify-center text-brand-orange hover:bg-brand-orange hover:text-white transition-all cursor-pointer">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">Explore</h4>
              <div className="flex flex-col gap-4 text-sm font-medium text-brand-charcoal/60">
                {navLinks.map((link) => (
                  <button key={link.id} onClick={() => handleNav(link.id)} className={`hover:text-brand-orange transition-colors cursor-pointer text-left ${page === link.id ? 'text-brand-orange' : 'text-brand-charcoal/60'}`}>{link.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-brand-border pt-12">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-charcoal/20">
              © 2025 MasterChef4Many. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
