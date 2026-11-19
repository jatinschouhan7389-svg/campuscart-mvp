import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export function ProductImage({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`${aspectClass} w-full bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/60 flex flex-col items-center justify-center p-6 text-center text-slate-500 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-8 h-8 text-teal-700/70 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[180px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} w-full overflow-hidden bg-slate-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
      />
    </div>
  );
}
