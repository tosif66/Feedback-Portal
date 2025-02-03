import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import WaveBackground from '../components/WaveBackground';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center relative">
      <WaveBackground />
      
      <div className="relative z-10 w-full">
        <Navbar />
        <Header />
      </div>
    </div>
  );
}

export default Home;
