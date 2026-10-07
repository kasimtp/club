import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowUpRight, FiVolume2, FiVolumeX, FiPlay } from 'react-icons/fi';
import { ikUrl, ikVideoUrl, videoPosterUrl, targetWidth, prefersLightMedia } from '../services/imagekitService';

import { isVideoSlide } from '../utils/media';

const IMAGE_ROTATE_MS = 6000;

// Slides made in the mobile app store screen names ("Membership"); the website uses paths
const APP_SCREEN_ROUTES = {
  Home: '/', Events: '/events', Programs: '/programs', Gallery: '/gallery', Membership: '/membership',
  About: '/about', More: '/about', Services: '/services', Team: '/team', Contact: '/contact',
};
const routeFor = (screen) =>
  screen.startsWith('/') ? screen : APP_SCREEN_ROUTES[screen] || `/${screen.toLowerCase()}`;

// Rimmed media card ("Meditate" tile).
// Landscape media fills the card and fades into a pale base with a dark label.
// Portrait posters / reels sit in their own frame on a soft blurred backdrop (full-bleed on phones).
export default function HomeSlider({ slides = [], className = '' }) {
  const [rawIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [measured, setMeasured] = useState({}); // mediaUrl -> width / height
  const [failedTranscodes, setFailedTranscodes] = useState({}); // mediaUrl -> true: play the original file
  const [lightMode] = useState(prefersLightMedia); // Data Saver / 2G: poster first, play on tap
  const [startedUrl, setStartedUrl] = useState(null); // video the visitor tapped to play in light mode
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const activeSlides = slides.filter(s => s.active !== false);
  // Clamp so hiding / deleting slides never leaves the index past the end
  const currentIndex = activeSlides.length ? rawIndex % activeSlides.length : 0;
  const currentSlide = activeSlides[currentIndex];
  const isVideo = isVideoSlide(currentSlide);

  // Images rotate on a timer; videos advance when they finish playing
  useEffect(() => {
    if (activeSlides.length <= 1 || isVideo) return;
    const timer = setTimeout(() => {
      setCurrentIndex(() => (currentIndex + 1) % activeSlides.length);
    }, IMAGE_ROTATE_MS);
    return () => clearTimeout(timer);
  }, [activeSlides.length, currentIndex, isVideo]);

  // Warm the cache for the next slide: its image, or its video's poster frame
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const next = activeSlides[(currentIndex + 1) % activeSlides.length];
    if (!next?.mediaUrl) return;
    const img = new Image();
    img.src = isVideoSlide(next)
      ? videoPosterUrl(next.mediaUrl, { width: targetWidth(760) }) || next.posterUrl || ''
      : ikUrl(next.mediaUrl, { width: targetWidth(760) });
  }, [currentIndex, activeSlides]);

  if (!currentSlide) return null;

  const ratio = Number(currentSlide.aspectRatio) || measured[currentSlide.mediaUrl] || 16 / 9;
  const isPortrait = ratio < 0.9;
  const hasCta = currentSlide.ctaType !== 'none';
  const multi = activeSlides.length > 1;

  const recordRatio = (w, h) => {
    if (!w || !h) return;
    setMeasured((prev) => (prev[currentSlide.mediaUrl] ? prev : { ...prev, [currentSlide.mediaUrl]: w / h }));
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % activeSlides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleCtaClick = () => {
    if (currentSlide.ctaType === 'url' && currentSlide.ctaUrl) {
      window.open(currentSlide.ctaUrl, '_blank', 'noopener,noreferrer');
    } else if (currentSlide.ctaScreen) {
      navigate(routeFor(currentSlide.ctaScreen));
    } else {
      navigate('/membership');
    }
  };

  // Request media sized for how big it is on screen: the portrait frame is narrow, landscape fills the card
  // Only resize when the orientation is already stored on the slide; otherwise the size would
  // change once the video's real shape is measured and the browser would download it twice.
  const viewport = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const storedRatio = Number(currentSlide.aspectRatio) || null;
  const mediaWidth = storedRatio
    ? storedRatio < 0.9
      ? targetWidth(Math.min(viewport, 460), 720)   // portrait reel / poster frame
      : targetWidth(Math.min(viewport, 760), 1280)  // landscape fills the card
    : undefined;
  const src = currentSlide.mediaUrl;
  const videoSrc = failedTranscodes[src] ? src : ikVideoUrl(src, { width: mediaWidth });
  const poster = videoPosterUrl(src, { width: mediaWidth }) || currentSlide.posterUrl || undefined;
  const waitingForTap = isVideo && lightMode && startedUrl !== src;

  const mediaClass = 'w-full h-full object-cover transition-transform duration-[1200ms] ease-out';
  const media = isVideo ? (
    waitingForTap ? (
      <button
        type="button"
        onClick={() => setStartedUrl(src)}
        className="relative w-full h-full block"
        aria-label={`Play video${currentSlide.title ? `: ${currentSlide.title}` : ''}`}
      >
        {poster && <img src={poster} alt="" className={mediaClass} />}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-white/90 text-ember flex items-center justify-center shadow-[0_12px_28px_-10px_rgba(242,104,58,0.6)]">
            <FiPlay className="text-2xl fill-current ml-1" />
          </span>
        </span>
      </button>
    ) : (
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        poster={poster}
        preload="auto"
        autoPlay
        loop={!multi}
        muted={isMuted}
        playsInline
        onEnded={multi ? handleNext : undefined}
        onLoadedMetadata={(e) => recordRatio(e.currentTarget.videoWidth, e.currentTarget.videoHeight)}
        onError={() => {
          // ImageKit couldn't transcode (e.g. still processing or over quota): fall back to the original
          if (videoSrc !== src) setFailedTranscodes((prev) => ({ ...prev, [src]: true }));
        }}
        className={`${mediaClass} ${isPortrait ? '' : 'group-hover:scale-105'}`}
      />
    )
  ) : (
    <img
      key={src}
      src={ikUrl(src, { width: mediaWidth || targetWidth(Math.min(viewport, 760), 1280) })}
      alt={currentSlide.title}
      fetchPriority={currentIndex === 0 ? 'high' : 'auto'}
      decoding="async"
      onLoad={(e) => recordRatio(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
      className={`${mediaClass} saturate-[1.1] animate-fade-in ${isPortrait ? '' : 'group-hover:scale-105'}`}
    />
  );

  const label = (
    <>
      <div className="min-w-0 animate-slide-up" key={currentSlide.id || currentIndex}>
        {isPortrait && (
          <p className="hidden sm:inline-flex items-center gap-1.5 mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-ember" />
            {isVideo ? 'Now playing' : 'Featured'}
          </p>
        )}
        <h2 className="font-display text-2xl sm:text-3xl lg:text-[34px] font-semibold text-ink tracking-tight leading-[1.1] max-w-xl">
          {currentSlide.title}
        </h2>
        {currentSlide.ctaLabel && hasCta && (
          <p className="mt-2 text-xs font-semibold text-ink-muted">{currentSlide.ctaLabel}</p>
        )}
      </div>

      {hasCta && (
        <button
          type="button"
          onClick={handleCtaClick}
          className="shrink-0 w-12 h-12 rounded-full bg-white text-ember flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(242,104,58,0.6)] hover:bg-ember hover:text-white transition-all"
          aria-label={currentSlide.ctaLabel || 'Open'}
        >
          <FiArrowUpRight className="text-xl" />
        </button>
      )}
    </>
  );

  return (
    <div className={`rim relative w-full rounded-[34px] group ${className}`}>
      <div
        className={`relative w-full h-full overflow-hidden rounded-[28px] bg-white ${
          isPortrait ? 'min-h-[540px] sm:min-h-[460px]' : 'min-h-[400px] sm:min-h-[460px]'
        }`}
      >
        {isPortrait ? (
          <>
            {/* Soft backdrop: blurred copy of the poster (images) or the pastel canvas (videos) */}
            {isVideo ? (
              <div className="sense-canvas absolute inset-0 hidden sm:block" />
            ) : (
              <img
                src={ikUrl(currentSlide.mediaUrl, { width: 160, quality: 50 })}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-125 blur-2xl opacity-60 saturate-150 hidden sm:block"
              />
            )}
            <div className="absolute inset-0 bg-white/45 hidden sm:block" />
            <div className="dot-grid absolute inset-0 hidden sm:block" aria-hidden="true" />

            {/* Phones: poster full-bleed with the label over a light fade.
                sm+: poster framed on the right, label takes exactly the space left of it. */}
            <div className="absolute inset-0 flex flex-col sm:flex-row-reverse sm:p-5 sm:gap-6">
              <div
                className="absolute inset-0 sm:static sm:h-full sm:max-w-[62%] sm:shrink-0 sm:[aspect-ratio:var(--media-ratio)] sm:rounded-[22px] sm:border-[5px] sm:border-white overflow-hidden sm:shadow-[0_24px_48px_-20px_rgba(70,50,90,0.45)]"
                style={{ '--media-ratio': ratio }}
              >
                {media}
              </div>
              <div className="absolute inset-0 fade-light sm:hidden" />
              <div className="relative z-10 mt-auto sm:flex-1 min-w-0 flex items-end justify-between gap-4 p-5 sm:p-2 sm:flex-col sm:items-start sm:justify-end">
                {label}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0">{media}</div>
            {/* Soft pastel tint + light fade so the label reads dark-on-light */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB59A]/20 via-transparent to-[#C9B3F5]/25 mix-blend-soft-light" />
            <div className="absolute inset-0 fade-light" />
          </>
        )}

        {/* Video sound toggle */}
        {isVideo && (
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`absolute top-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink flex items-center justify-center transition-all ${
              isPortrait ? 'right-4 sm:right-9 sm:top-9' : 'right-4'
            }`}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <FiVolumeX className="text-lg" /> : <FiVolume2 className="text-lg" />}
          </button>
        )}

        {/* Top-left counter + progress dots */}
        {multi && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 h-8 px-3 rounded-full bg-white/90 text-[11px] font-semibold text-ink">
            <span>
              {String(currentIndex + 1).padStart(2, '0')} / {String(activeSlides.length).padStart(2, '0')}
            </span>
            <span className="flex items-center gap-1">
              {activeSlides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-5 bg-ember' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </span>
          </div>
        )}

        {/* Landscape: label + CTA along the bottom */}
        {!isPortrait && (
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-5 sm:p-7">
            {label}
          </div>
        )}

        {/* Navigation Arrows */}
        {multi && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Previous Slide"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-ink items-center justify-center transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              aria-label="Next Slide"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
