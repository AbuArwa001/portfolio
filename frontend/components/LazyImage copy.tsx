// components/LazyImage.tsx
import React, { useState } from "react";
import Image from "next/image";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative">
      {!loaded && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
          <Image
            src={src}
            alt={alt}
            className={`${className} ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </>
      )}
    </div>
  );
};

export default LazyImage;
