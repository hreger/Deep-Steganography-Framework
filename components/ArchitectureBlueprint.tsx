import React, { useState } from 'react';
import { ChevronsUpDownIcon, InfoIcon, ShieldIcon, KeyIcon, CpuIcon, WandIcon, EyeIcon, BotIcon, TargetIcon } from './icons/Icons';

const architectureModules = [
  {
    icon: <ShieldIcon size={20} />,
    title: "1. Message Security Layer",
    description: "Cryptographic preprocessing (AEAD) and error-correcting codes (LDPC/BCH) are applied to ensure confidentiality, integrity, and payload reliability."
  },
  {
    icon: <KeyIcon size={20} />,
    title: "2. Key Derivation & Conditioning",
    description: "A session-specific feature key is derived from a shared secret. This key conditions the encoder and decoder to ensure only authorized users can perform embedding/extraction."
  },
  {
    icon: <CpuIcon size={20} />,
    title: "3. Hider / Encoder Network",
    description: "A U-Net/ResNet backbone embeds the coded message into the cover image across multiple scales, minimizing visual artifacts."
  },
  {
    icon: <WandIcon size={20} />,
    title: "4. Training-only EOT Distortion Layer",
    description: "During training, an Expectation-over-Transformations (EOT) layer applies random distortions (JPEG, noise, resize) to make the decoder robust to real-world degradations."
  },
  {
    icon: <EyeIcon size={20} />,
    title: "5. Revealer / Decoder Network",
    description: "A lightweight ResNet/Transformer network extracts the hidden bits, applies ECC decoding, and performs decryption to restore the original secret message."
  },
  {
    icon: <BotIcon size={20} />,
    title: "6. Multi-Detector Adversarial Ensemble",
    description: "A collection of diverse steganalysis networks are trained against the Hider in a min-max game, forcing the Hider to produce highly undetectable stego-images."
  }
];

const trainingLosses = [
    { title: "Message Recovery Loss", description: "Ensures the decoded message matches the original." },
    { title: "Perceptual Loss", description: "Keeps the image visually unchanged to the human eye (LPIPS/SSIM)." },
    { title: "Image Similarity Loss", description: "Minimizes raw pixel differences between cover and stego (L2/PSNR)." },
    { title: "Frequency Regularization", description: "Penalizes changes in low-frequency domains that are easy to detect." },
    { title: "Adversarial Loss", description: "Encourages the Hider to generate images that fool the detectors." },
]

export const ArchitectureBlueprint: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/80 rounded-lg shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <InfoIcon className="text-cyan-400" />
          <h2 className="text-xl font-bold text-slate-100">Architectural Blueprint</h2>
        </div>
        <ChevronsUpDownIcon className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-slate-400 mb-6">
            This simulator demonstrates the workflow of the proposed deep steganography framework. The modules below outline the key components of a complete, production-grade system.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architectureModules.map((module) => (
              <div key={module.title} className="bg-slate-900/60 p-3 rounded-md border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-400">{module.icon}</span>
                  <h4 className="font-semibold text-slate-200">{module.title}</h4>
                </div>
                <p className="text-xs text-slate-400">{module.description}</p>
              </div>
            ))}
          </div>
            <div className="mt-6 pt-4 border-t border-slate-700">
                 <div className="flex items-center gap-3 mb-4">
                    <TargetIcon className="text-cyan-400" />
                    <h3 className="text-lg font-bold text-slate-100">Training Objectives & Losses</h3>
                </div>
                 <p className="text-slate-400 mb-4 text-sm">
                    The AI model is trained by minimizing a combination of the following loss functions, which mathematically represent the system's goals:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trainingLosses.map((loss) => (
                        <div key={loss.title} className="bg-slate-900/60 p-3 rounded-md border border-slate-700">
                            <h4 className="font-semibold text-slate-200 text-sm">{loss.title}</h4>
                            <p className="text-xs text-slate-400">{loss.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};