import React from 'react';
import type { DistortionSettings } from '../types';
import { WandIcon } from './icons/Icons';

interface DistortionControlsProps {
  settings: DistortionSettings;
  onChange: (settings: DistortionSettings) => void;
  onApply: () => void;
  disabled: boolean;
}

export const DistortionControls: React.FC<DistortionControlsProps> = ({ settings, onChange, onApply, disabled }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...settings, [name]: parseFloat(value) });
  };

  const isNoiseOff = settings.noise === 0;
  const isResizeOff = settings.resize === 1.0;
  // For JPEG, higher is better quality. 95 is the max/least distortion in this range.
  const isJpegMaxQuality = settings.jpeg === 95;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="jpeg" className="text-sm font-medium text-slate-300 flex justify-between">
          JPEG Quality <span>{settings.jpeg}%</span>
        </label>
        <input
          type="range"
          id="jpeg"
          name="jpeg"
          min="50"
          max="95"
          step="5"
          value={settings.jpeg}
          onChange={handleSliderChange}
          className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer transition-colors duration-200 ${isJpegMaxQuality ? 'accent-slate-500' : 'accent-teal-500'}`}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="noise" className="text-sm font-medium text-slate-300 flex justify-between">
            Gaussian Noise <span>{settings.noise}</span>
        </label>
        <input
          type="range"
          id="noise"
          name="noise"
          min="0"
          max="5"
          step="1"
          value={settings.noise}
          onChange={handleSliderChange}
          className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer transition-colors duration-200 ${isNoiseOff ? 'accent-slate-500' : 'accent-teal-500'}`}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="resize" className="text-sm font-medium text-slate-300 flex justify-between">
            Resize Scale <span>{settings.resize.toFixed(2)}x</span>
        </label>
        <input
          type="range"
          id="resize"
          name="resize"
          min="0.75"
          max="1.0"
          step="0.05"
          value={settings.resize}
          onChange={handleSliderChange}
          className={`w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer transition-colors duration-200 ${isResizeOff ? 'accent-slate-500' : 'accent-teal-500'}`}
          disabled={disabled}
        />
      </div>
      <button 
        onClick={onApply} 
        disabled={disabled} 
        className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
      >
        <WandIcon /> Apply Distortions
      </button>
    </div>
  );
};