import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiVolume2, FiVolumeX, FiPlay } from 'react-icons/fi';
import Button from './ui/Button';

export default function HomeSlider({ slides = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const activeSlides = slides.filter(s => s.active !== false);

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSlides.length, currentIndex]);

  if (activeSlides.length === 0) return null;

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const isVideo = currentSlide.mediaType === 'video' || currentSlide.mediaUrl?.endsWith('.mp4');

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleCtaClick = () => {
    if (currentSlide.ctaType === 'url' && currentSlide.ctaUrl) {
      window.open(currentSlide.ctaUrl, '_blank', 'noopener,noreferrer');
    } else if (currentSlide.ctaScreen) {
      navigate(currentSlide.ctaScreen);
    } else {
      navigate('/membership');
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-black shadow-xl group">
      {/* Slider Viewport: 9:16 on small mobile or 16:9 on md/lg */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] max-h-[580px] overflow-hidden">
        {/* Media Background */}
        {isVideo ? (
          <video
            ref={videoRef}
            key={currentSlide.mediaUrl}
            src={currentSlide.mediaUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <img
            key={currentSlide.mediaUrl}
            src={currentSlide.mediaUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 animate-fade-in"
          />
        )}

        {/* Cinematic Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Top Video Controls if Video */}
        {isVideo && (
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center justify-center transition-all"
            aria-label="Toggle sound"
          >
            {isMuted ? <FiVolumeX className="text-lg" /> : <FiVolume2 className="text-lg" />}
          </button>
        )}

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl">
          <div className="space-y-3 sm:space-y-4 animate-slide-up">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-md">
              Universal Club • Kerala
            </span>
            
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h2>

            {currentSlide.ctaLabel && currentSlide.ctaType !== 'none' && (
              <div className="pt-2">
                <Button
                  onClick={handleCtaClick}
                  variant="amber"
                  size="md"
                  iconRight={FiArrowRight}
                >
                  {currentSlide.ctaLabel}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Previous Slide"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-950 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Next Slide"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          </>
        )}

        {/* Bottom Dot Indicators */}
        {activeSlides.length > 1 && (
          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
