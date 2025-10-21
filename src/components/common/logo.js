import Image from 'next/image';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeMap = {
    small: { width: 140, height: 60 },
    medium: { width: 233, height: 100 },
    large: { width: 350, height: 150 },
    hero: { width: 467, height: 200 },
  };

  const dimensions = sizeMap[size] || sizeMap.medium;

  return (
    <Image
      src="/images/logo.svg"
      alt="IKER Finance"
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      priority
    />
  );
};

export default Logo;
