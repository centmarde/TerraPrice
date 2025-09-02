

import Slideshow from '@/components/slideshow';

// We'll create a component that uses the theme
const ThemedHero = () => {
  const images = [
    'https://via.placeholder.com/800x400/FF0000/FFFFFF?text=Slide+1',
    'https://via.placeholder.com/800x400/00FF00/FFFFFF?text=Slide+2',
    'https://via.placeholder.com/800x400/0000FF/FFFFFF?text=Slide+3',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Slideshow Test</h1>
      <Slideshow images={images} />
    </div>
  );
}

export default ThemedHero;
