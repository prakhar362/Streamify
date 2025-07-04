import React from 'react';
import { Button } from './button';

const slides = [
  {
    title: "Zucchini & Squash",
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Feijoa",
    image: "https://images.unsplash.com/photo-1541857754-557a44522bec?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Strawberry",
    image: "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Purple Cauliflower",
    image: "https://images.unsplash.com/photo-1620053927547-cf64d4829ff4?auto=format&fit=crop&w=400&q=80",
  },
];

const Cta = () => (
  <section className="w-full max-w-6xl mx-auto py-16 px-4 flex flex-col md:flex-row items-center justify-between gap-10">
    {/* Left: Text */}
    <div className="flex-1 min-w-[280px] max-w-xl w-full mb-15 md:mb-0">
      <span className="text-lg font-semibold text-gray-700">Discover</span>
      <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-teal-500 to-blue-700 bg-clip-text text-transparent mt-2 mb-8">Streamify</h1>
      
      <p className="text-base md:text-lg text-gray-700 mb-8 mt-8">
        Explore a vibrant harvest of organic, seasonal fruits and vegetables, bursting with flavors. Unveil a paramount selection of naturally delicious and nutritious premium produce sourced directly from local farms!
      </p>
      <Button className="px-8 md:px-10 py-3 md:py-4 rounded-full hover:bg-gray-700 hover:text-black  text-white text-base md:text-lg font-semibold" onClick={() => console.log('Main button clicked for LTR')}>
        Shop Now
      </Button>
    </div>
    {/* Right: Responsive Puzzle Image Grid */}
    <div className="flex-1 flex justify-center w-full">
      <div
        className="grid grid-cols-2 gap-3 md:gap-5 w-full"
        style={{
          maxWidth: 400,
          maxHeight: 400,
          aspectRatio: '1 / 1',
        }}
      >
        {[slides[3], slides[2], slides[1], slides[0]].map((slide, index) => (
          <div
            key={index}
            className="relative w-full aspect-square overflow-hidden rounded-2xl"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`warped-image ${['bottom-right', 'bottom-left', 'top-right', 'top-left'][index]} w-full h-full object-cover`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </div>
    </div>
    <style jsx>{`
        .warped-image {
          --r: 20px;
          --s: 40px;
          --x: 25px;
          --y: 5px;
        }
        .top-right {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(at calc(100% - var(--r)) var(--r),#0000 25%,#000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(100% - var(--_d) - var(--x)) 0 var(--_m), 100% calc(var(--_d) + var(--y)) var(--_m), radial-gradient(var(--s) at 100% 0,#0000 99%,#000 calc(100% + 1px)) calc(-1*var(--r) - var(--x)) calc(var(--r) + var(--y)), var(--_g) calc(-1*var(--_d) - var(--x)) 0, var(--_g) 0 calc(var(--_d) + var(--y));
          mask-repeat: no-repeat;
        }
        .top-left {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(at var(--r) var(--r),#000 75%,#0000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(var(--_d) + var(--x)) 0 var(--_m), 0 calc(var(--_d) + var(--y)) var(--_m), radial-gradient(var(--s) at 0 0,#0000 99%,#000 calc(100% + 1px)) calc(var(--r) + var(--x)) calc(var(--r) + var(--y)), var(--_g) calc(var(--_d) + var(--x)) 0, var(--_g) 0 calc(var(--_d) + var(--y));
          mask-repeat: no-repeat;
        }
        .bottom-left {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(from 180deg at var(--r) calc(100% - var(--r)),#0000 25%,#000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(var(--_d) + var(--x)) 100% var(--_m), 0 calc(100% - var(--_d) - var(--y)) var(--_m), radial-gradient(var(--s) at 0 100%,#0000 99%,#000 calc(100% + 1px)) calc(var(--r) + var(--x)) calc(-1*var(--r) - var(--y)), var(--_g) calc(var(--_d) + var(--x)) 0, var(--_g) 0 calc(-1*var(--_d) - var(--y));
          mask-repeat: no-repeat;
        }
        .bottom-right {
          --_m:/calc(2*var(--r)) calc(2*var(--r)) radial-gradient(#000 70%,#0000 72%);
          --_g:conic-gradient(from 90deg at calc(100% - var(--r)) calc(100% - var(--r)),#0000 25%,#000 0);
          --_d:(var(--s) + var(--r));
          mask: calc(100% - var(--_d) - var(--x)) 100% var(--_m), 100% calc(100% - var(--_d) - var(--y)) var(--_m), radial-gradient(var(--s) at 100% 100%,#0000 99%,#000 calc(100% + 1px)) calc(-1*var(--r) - var(--x)) calc(-1*var(--r) - var(--y)), var(--_g) calc(-1*var(--_d) - var(--x)) 0, var(--_g) 0 calc(-1*var(--_d) - var(--y));
          mask-repeat: no-repeat;
        }
      `}</style>
  </section>
);

export default Cta;