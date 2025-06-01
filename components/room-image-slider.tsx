"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageLightbox } from "./image-lightbox";

interface RoomImageSliderProps {
  images: string[];
  roomName: string;
}

export const RoomImageSlider = ({ images, roomName }: RoomImageSliderProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  
  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    setLightboxOpen(true);
  };
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);
  
  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  const findSlidesInView = useCallback(() => {
    if (!emblaApi) return;
    
    setSlidesInView(emblaApi.slidesInView());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    findSlidesInView();
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', findSlidesInView);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('reInit', findSlidesInView);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', findSlidesInView);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('reInit', findSlidesInView);
    };
  }, [emblaApi, onSelect, findSlidesInView]);
  
  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-[500px] rounded-lg overflow-hidden">
              <Image 
                src={image} 
                alt={`${roomName} - Görsel ${index + 1}`} 
                fill 
                className="object-cover cursor-pointer" 
                priority={index === 0}
                onClick={() => openLightbox(image)}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button 
          className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-sage-800 hover:bg-white transition-colors"
          onClick={scrollPrev}
          aria-label="Önceki görsel"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-sage-800 hover:bg-white transition-colors"
          onClick={scrollNext}
          aria-label="Sonraki görsel"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative h-20 rounded-md overflow-hidden border-2 ${selectedIndex === index ? 'border-sage-600' : 'border-transparent'} transition-all`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`${index + 1}. görsele git`}
          >
            <Image 
              src={image} 
              alt={`${roomName} - Küçük Görsel ${index + 1}`} 
              fill 
              className="object-cover cursor-pointer"
              onClick={() => openLightbox(image)}
            />
          </button>
        ))}
      </div>
      
      {/* Lightbox */}
      <ImageLightbox 
        isOpen={lightboxOpen} 
        imageUrl={lightboxImage} 
        onClose={() => setLightboxOpen(false)} 
      />
    </div>
  );
};
