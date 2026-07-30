import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const LightboxModal = ({ images = [], initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-lg animate-fadeIn">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative max-w-6xl w-full h-[80vh] flex flex-col items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-slate-800"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all border border-slate-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-950/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-all border border-slate-800"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Counter & Thumbnail strip */}
        <div className="mt-4 flex items-center gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LightboxModal;
