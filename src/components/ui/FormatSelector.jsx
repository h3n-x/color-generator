import { useColorContext } from '../../context/ColorContext';

const FormatSelector = () => {
  const { format, setFormat } = useColorContext();
  
  const formatOptions = [
    { id: 'hex', label: 'HEX' },
    { id: 'rgb', label: 'RGB' },
    { id: 'hsl', label: 'HSL' },
    { id: 'cmyk', label: 'CMYK' }
  ];
  
  return (
    <div className="flex-row items-center gap-2">
      <span className="pixel-text section-title">
        FORMATO:
      </span>
      <div className="flex-row">
        {formatOptions.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setFormat(fmt.id)}
            className={`px-3 py-1 text-xs uppercase ${
              format === fmt.id 
                ? 'bg-black text-white' 
                : 'bg-white hover:bg-gray-100'
            } retro-button`}
            title={`Cambiar a formato ${fmt.label}`}
          >
            {fmt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
