const ImagePreview: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-80 rounded-lg shadow-sm"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default ImagePreview;