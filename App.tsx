import React, { useState, useCallback } from 'react';
import { ModuleCard } from './components/ModuleCard';
import { ImageUploader } from './components/ImageUploader';
import { DistortionControls } from './components/DistortionControls';
import { ArchitectureBlueprint } from './components/ArchitectureBlueprint';
import { DistortionSettings } from './types';
import {
  LockIcon,
  KeyIcon,
  EyeIcon,
  CpuIcon,
  ImageIcon,
  MessageSquareIcon,
  ShieldIcon,
  WandIcon,
  EyeOffIcon,
  BotIcon,
  TargetIcon,
  HeartHandshakeIcon,
  RulerIcon,
  WavesIcon,
  ZapOffIcon,
} from './components/icons/Icons';

// --- Helper Functions ---

const applyXORCipher = (text: string, key: string): string => {
  if (!key) return text;
  let output = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    output += String.fromCharCode(charCode);
  }
  return output;
};

const textToBinary = (text: string): string => {
  return text
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
};

const binaryToText = (binary: string): string => {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    if (byte.length === 8) {
      text += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return text;
};

const addRepetitionCode = (binary: string): string => {
  return binary.split('').map(bit => bit.repeat(3)).join('');
};


const decodeWithRepetitionCode = (codedBits: string): { dataBits: string, correctedErrors: number } => {
  let dataBits = '';
  let correctedErrors = 0;
  for (let i = 0; i < codedBits.length; i += 3) {
    const chunk = codedBits.substr(i, 3);
    if (chunk.length < 3) break;
    
    const ones = (chunk.match(/1/g) || []).length;
    const decodedBit = ones >= 2 ? '1' : '0';
    
    if (chunk !== decodedBit.repeat(3)) {
        correctedErrors++;
    }
    
    dataBits += decodedBit;
  }
  return { dataBits, correctedErrors };
};


// --- Main App Component ---

const App: React.FC = () => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [secretMessage, setSecretMessage] = useState<string>('Secret message');
  const [secretKey, setSecretKey] = useState<string>('password123');

  const [encryptedMessage, setEncryptedMessage] = useState<string>('');
  const [codedMessage, setCodedMessage] = useState<string>('');
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [distortedImage, setDistortedImage] = useState<string | null>(null);

  const [decodedMessage, setDecodedMessage] = useState<string | null>(null);
  const [correctedErrors, setCorrectedErrors] = useState<number>(0);
  const [decodeKey, setDecodeKey] = useState<string>('password123');
  
  const [distortionSettings, setDistortionSettings] = useState<DistortionSettings>({ jpeg: 95, noise: 0, resize: 1.0 });

  const [isLoading, setIsLoading] = useState(false);
  const [isDistorting, setIsDistorting] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setEncryptedMessage('');
    setCodedMessage('');
    setStegoImage(null);
    setDistortedImage(null);
    setDecodedMessage(null);
    setCorrectedErrors(0);
    setError(null);
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
      resetState();
    };
    reader.readAsDataURL(file);
  };

  const handleEncode = useCallback(() => {
    if (!coverImage || !secretMessage || !secretKey) {
      setError('Please provide a cover image, secret message, and secret key.');
      return;
    }
    resetState();
    setIsLoading(true);

    setTimeout(() => {
      const encrypted = applyXORCipher(secretMessage, secretKey);
      setEncryptedMessage(encrypted);

      const binaryMessage = textToBinary(encrypted);
      
      const lenHeader = binaryMessage.length.toString(2).padStart(32, '0');

      const codedHeader = addRepetitionCode(lenHeader);
      const codedMsg = addRepetitionCode(binaryMessage);
      setCodedMessage(codedMsg);
      
      const dataToEmbed = codedHeader + codedMsg;

      const img = new Image();
      img.src = coverImage;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Could not process image.');
          setIsLoading(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            data[i+3] = 255;
        }

        const maxCapacity = Math.floor((data.length / 4) * 3);
        if (dataToEmbed.length > maxCapacity) {
            setError(`Message too long. Needs ${dataToEmbed.length} bits, capacity is ${maxCapacity}.`);
            setIsLoading(false);
            return;
        }
        
        let bitIndex = 0;
        for (let i = 0; i < data.length && bitIndex < dataToEmbed.length; i += 4) {
          for (let j = 0; j < 3; j++) {
            if(bitIndex < dataToEmbed.length) {
              const bit = parseInt(dataToEmbed[bitIndex++]);
              data[i+j] = (data[i+j] & 0xFE) | bit;
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setStegoImage(canvas.toDataURL('image/png'));
        setIsLoading(false);
      };
      img.onerror = () => {
        setError('Failed to load the cover image.');
        setIsLoading(false);
      }
    }, 500);
  }, [coverImage, secretMessage, secretKey, resetState]);

  const handleApplyDistortions = useCallback(() => {
    if (!stegoImage) {
      setError('Please embed a message first.');
      return;
    }
    setError(null);
    setIsDistorting(true);
    setDecodedMessage(null);

    setTimeout(() => {
       const img = new Image();
       img.src = stegoImage;
       img.onload = () => {
           const canvas = document.createElement('canvas');
           canvas.width = img.width * distortionSettings.resize;
           canvas.height = img.height * distortionSettings.resize;
           const ctx = canvas.getContext('2d');
           if(!ctx) {
                setError('Could not process image for distortion.');
                setIsDistorting(false);
                return;
           }

           ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
           
           if (distortionSettings.noise > 0) {
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imageData.data;
              for(let i = 0; i < data.length; i += 4) {
                  const noise = (Math.random() - 0.5) * distortionSettings.noise * 25;
                  data[i] = Math.max(0, Math.min(255, data[i] + noise));
                  data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
                  data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
              }
              ctx.putImageData(imageData, 0, 0);
           }
           
           const distortedDataUrl = canvas.toDataURL('image/jpeg', distortionSettings.jpeg / 100);
           setDistortedImage(distortedDataUrl);
           setIsDistorting(false);
       }
       img.onerror = () => {
            setError('Could not load stego image for distortion.');
            setIsDistorting(false);
       }
    }, 500);

  }, [stegoImage, distortionSettings]);


  const handleDecode = useCallback(() => {
    const imageToDecode = distortedImage || stegoImage;
    if (!imageToDecode || !decodeKey) {
      setError('Please provide an image and a key.');
      return;
    }
    setError(null);
    setIsDecoding(true);
    setDecodedMessage(null);
    setCorrectedErrors(0);

    const img = new Image();
    img.src = imageToDecode;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          setError('Could not process image.');
          setIsDecoding(false);
          return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const BITS_FOR_CODED_HEADER = 32 * 3;

      let codedHeaderBits = '';
      let bitCount = 0;
      for (let i = 0; i < data.length && bitCount < BITS_FOR_CODED_HEADER; i+=4) {
          for (let j=0; j<3 && bitCount < BITS_FOR_CODED_HEADER; j++) {
              codedHeaderBits += data[i+j] & 1;
              bitCount++;
          }
      }

      if (codedHeaderBits.length < BITS_FOR_CODED_HEADER) {
          setError("Could not extract full message header. Image is too small or corrupt.");
          setIsDecoding(false);
          return;
      }

      const { dataBits: headerBits, correctedErrors: headerErrors } = decodeWithRepetitionCode(codedHeaderBits);
      const messageBinaryLength = parseInt(headerBits, 2);
      
      const codedMessageLength = messageBinaryLength * 3;
      const totalBitsToExtract = BITS_FOR_CODED_HEADER + codedMessageLength;
      const maxCapacity = Math.floor((data.length / 4) * 3);

      if (isNaN(messageBinaryLength) || messageBinaryLength <= 0 || totalBitsToExtract > maxCapacity || messageBinaryLength % 8 !== 0) {
          let detailedError = `Invalid message length detected (${messageBinaryLength}). Data is likely corrupt or the key is incorrect.`;
          if (distortedImage) {
            detailedError += " The applied distortions (especially JPEG & Resizing) are destructive and have likely corrupted the data beyond what the simple error correction can repair.";
          }
          setError(detailedError);
          setIsDecoding(false);
          return;
      }

      let allExtractedBits = '';
      bitCount = 0;
      for(let i = 0; i < data.length && bitCount < totalBitsToExtract; i+=4) {
          for(let j=0; j<3 && bitCount < totalBitsToExtract; j++) {
              allExtractedBits += data[i+j] & 1;
              bitCount++;
          }
      }

      if (allExtractedBits.length < totalBitsToExtract) {
          setError("Could not extract full message. Image may be corrupt or too distorted.");
          setIsDecoding(false);
          return;
      }

      const codedMessageBits = allExtractedBits.substring(BITS_FOR_CODED_HEADER);
      const { dataBits: messageBits, correctedErrors: messageErrors } = decodeWithRepetitionCode(codedMessageBits);

      setCorrectedErrors(headerErrors + messageErrors);
      
      const encryptedText = binaryToText(messageBits);
      const decryptedMessage = applyXORCipher(encryptedText, decodeKey);

      setDecodedMessage(decryptedMessage);
      setIsDecoding(false);
    };
     img.onerror = () => {
      setError('Failed to load the stego image.');
      setIsDecoding(false);
    }
  }, [distortedImage, stegoImage, decodeKey]);


  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700/30 via-slate-900 to-slate-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Deep Steganography Framework
          </h1>
          <p className="mt-3 text-lg text-slate-400">An interactive simulation of a modern, adversarially-trained steganography architecture.</p>
        </header>
        
        <ArchitectureBlueprint />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-10">
          
          {/* --- Column 1: Inputs & Security --- */}
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-300 text-center border-b-2 border-slate-700 pb-3">1. Encoder Input & Security</h2>
             <ModuleCard title="Cover Image & Message" icon={<ImageIcon />} description="Select the cover image and the secret message to embed.">
                <ImageUploader onImageUpload={handleImageUpload} />
                {coverImage && <img src={coverImage} alt="Cover" className="mt-4 rounded-lg shadow-lg" />}
                <textarea
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    placeholder="Enter secret message..."
                    className="w-full mt-4 p-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    rows={2}
                />
            </ModuleCard>
             <ModuleCard title="Key Derivation" icon={<KeyIcon />} description="Enter a shared secret key to secure the process.">
                 <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key..."
                    className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                />
            </ModuleCard>
             <ModuleCard 
                title="Message Security Layer" 
                icon={<ShieldIcon />} 
                description="Encrypts the message and adds error-correcting codes."
                simulationNote="Simulated using a simple XOR cipher and a 3x repetition code for error correction."
             >
                  <div className="text-xs font-mono bg-slate-800/70 border border-slate-700 p-2 rounded-md break-words h-20 overflow-y-auto backdrop-blur-sm"><b>Encrypted:</b> {encryptedMessage || "..."}</div>
                  <div className="text-xs font-mono bg-slate-800/70 border border-slate-700 p-2 mt-2 rounded-md break-words h-20 overflow-y-auto backdrop-blur-sm"><b>ECC Added:</b> {codedMessage || "..."}</div>
              </ModuleCard>
             <button
                onClick={handleEncode}
                disabled={isLoading || !coverImage}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30"
            >
                {isLoading ? <><CpuIcon className="animate-spin" /> Embedding...</> : <><EyeOffIcon /> Run Hider Network</>}
            </button>
          </div>

          {/* --- Column 2: Hider & Distortion --- */}
          <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-300 text-center border-b-2 border-slate-700 pb-3">2. AI Training Simulation</h2>
              <ModuleCard 
                title="Hider / Encoder Network" 
                icon={<CpuIcon />} 
                description="Embeds the coded message into the cover image."
                simulationNote="Simulated using Least Significant Bit (LSB) embedding for visual demonstration."
              >
                 {stegoImage ? <img src={stegoImage} alt="Stego" className="rounded-lg shadow-lg" /> : <div className="h-40 bg-slate-800/70 border border-dashed border-slate-700 rounded-md flex items-center justify-center text-slate-500">Stego Image...</div>}
              </ModuleCard>
              <ModuleCard 
                title="EOT Distortion Simulation" 
                icon={<WandIcon />} 
                description="Simulates real-world degradations to test decoder robustness."
                simulationNote="This interactive layer simulates the training-time distortions applied to the stego-image."
              >
                <DistortionControls settings={distortionSettings} onChange={setDistortionSettings} onApply={handleApplyDistortions} disabled={!stegoImage || isDistorting} />
                 {distortedImage ? <img src={distortedImage} alt="Distorted Stego" className="mt-4 rounded-lg shadow-lg" /> : <div className="mt-4 h-40 bg-slate-800/70 border border-dashed border-slate-700 rounded-md flex items-center justify-center text-slate-500">Distorted Image...</div>}
              </ModuleCard>
              <ModuleCard
                  title="Training Objectives & Losses"
                  icon={<TargetIcon />}
                  description="Mathematical goals the AI model optimizes for during training."
                  simulationNote="The Hider network is trained to minimize a weighted sum of these loss functions, balancing payload recovery with undetectability."
              >
                  <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md"><TargetIcon size={16} className="text-teal-400 flex-shrink-0" /><span><b>Message Recovery:</b> Ensure the decoder can read the message.</span></div>
                      <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md"><HeartHandshakeIcon size={16} className="text-teal-400 flex-shrink-0" /><span><b>Perceptual Loss:</b> Keep the stego-image visually identical to the human eye.</span></div>
                      <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md"><RulerIcon size={16} className="text-teal-400 flex-shrink-0" /><span><b>Image Similarity:</b> Minimize pixel-level differences (L2/PSNR).</span></div>
                      <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md"><WavesIcon size={16} className="text-teal-400 flex-shrink-0" /><span><b>Frequency Regularization:</b> Avoid detectable changes in frequency bands.</span></div>
                      <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-md"><ZapOffIcon size={16} className="text-teal-400 flex-shrink-0" /><span><b>Adversarial Loss:</b> Fool the detector ensemble.</span></div>
                  </div>
              </ModuleCard>
                <ModuleCard
                    title="Multi-Detector Adversarial Ensemble"
                    icon={<BotIcon />}
                    description="A set of detectors that try to distinguish clean from stego images."
                    simulationNote="This is a training-time concept. The goal is to train the Hider to fool these detectors. It is not an active part of this inference simulation."
                >
                    <div className="text-center text-slate-400 p-4 bg-slate-800/50 rounded-md">
                        <p>Training Objective: Minimize Detectability</p>
                    </div>
                </ModuleCard>
          </div>

          {/* --- Column 3: Revealer --- */}
          <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-300 text-center border-b-2 border-slate-700 pb-3">3. Decoder & Output</h2>
               <ModuleCard title="Input for Revealer" icon={<ImageIcon />} description="The (potentially distorted) image containing the hidden message.">
                 {distortedImage || stegoImage ? <img src={distortedImage || stegoImage!} alt="Stego to decode" className="rounded-lg shadow-lg" /> : <div className="h-40 bg-slate-800/70 border border-dashed border-slate-700 rounded-md flex items-center justify-center text-slate-500">Waiting...</div>}
              </ModuleCard>
              <ModuleCard 
                title="Revealer / Decoder Network" 
                icon={<EyeIcon />} 
                description="Extracts, applies ECC, and decrypts the message."
                simulationNote="Simulated using LSB extraction, majority-vote ECC, and XOR decryption."
              >
                <div className="flex flex-col gap-3">
                     <input
                        type="password"
                        placeholder="Enter secret key to decode"
                        value={decodeKey}
                        onChange={(e) => setDecodeKey(e.target.value)}
                        className="w-full p-2 bg-slate-700/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                    />
                    <button onClick={handleDecode} disabled={isDecoding || (!stegoImage && !distortedImage)} className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30">
                      {isDecoding ? <><CpuIcon className="animate-spin" /> Decoding...</> : <><EyeIcon /> Reveal Message</>}
                    </button>
                </div>
                 <div className={`mt-4 text-lg font-mono p-3 rounded-md break-words transition-all duration-300 ${decodedMessage !== null ? 'bg-green-500/10 border border-green-500/30 text-green-300 shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'bg-slate-800/70 border border-slate-700 text-slate-500'}`}>
                    {decodedMessage ?? 'Decoded message...'}
                </div>
                {decodedMessage !== null && (
                     <p className={`text-sm mt-2 text-center p-1 rounded-md ${correctedErrors > 0 ? 'text-amber-400 bg-amber-500/10' : 'text-green-400 bg-green-500/10'}`}>
                        Corrected bit errors: {correctedErrors}
                    </p>
                )}
              </ModuleCard>
              {error && <p className="text-red-400 text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;