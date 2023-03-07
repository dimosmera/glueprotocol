import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  width: number;
  height: number;
}

// 1x1 pixel image generated from https://shoonia.github.io/1x1/#00000014
const FALLBACK_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj2L7v9H8AB7ADQNSL7qwAAAAASUVORK5CYII=";

const Image = ({ src, alt, width, height }: Props) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleLoadError = () => {
    setImgSrc(FALLBACK_IMG);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={handleLoadError}
    />
  );
};

export default Image;
