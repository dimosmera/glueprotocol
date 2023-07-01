interface Props {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
}

// 1x1 pixel image generated from https://shoonia.github.io/1x1/#00000014
const FALLBACK_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj2L7v9H8AB7ADQNSL7qwAAAAASUVORK5CYII=";

const Image = ({ src, alt, width, height }: Props) => {
  return (
    <img src={src || FALLBACK_IMG} alt={alt} width={width} height={height} />
  );
};

export default Image;
