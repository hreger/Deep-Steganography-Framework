import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

const createIcon = (path: React.ReactNode) => {
  const IconComponent: React.FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  );
  return IconComponent;
};

export const LockIcon = createIcon(<rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />);
export const KeyIcon = createIcon(<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />);
export const EyeIcon = createIcon(<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>);
export const EyeOffIcon = createIcon(<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>);
export const WandIcon = createIcon(<><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h.01" /><path d="M17 15h.01" /><path d="M11.8 17.8 13 19" /><path d="M4.2 11.8 3 13" /><path d="M7.2 4.2 6 3" /><path d="M12 22a2.83 2.83 0 0 0 4-4L7.5 6.5A3 3 0 0 0 2 12a2.83 2.83 0 0 0 4 4L16.5 7.5A3 3 0 0 0 22 12" /></>);
export const ShieldIcon = createIcon(<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />);
export const CpuIcon = createIcon(<><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></>);
export const ImageIcon = createIcon(<><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></>);
export const MessageSquareIcon = createIcon(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />);
export const UploadCloudIcon = createIcon(<><path d="M16 16l-4-4-4 4M12 12v9"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/><path d="M16 16l-4-4-4 4"/></>);
export const InfoIcon = createIcon(<><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>);
export const BotIcon = createIcon(<><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></>);
export const ChevronsUpDownIcon = createIcon(<><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></>);
export const TargetIcon = createIcon(<><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>);
export const HeartHandshakeIcon = createIcon(<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.82 2.96 0L12 11l2.96-2.96c.82-.82 2.13-.82 2.96 0v0a2.17 2.17 0 0 0 0-3.08L12 5Z" />);
export const RulerIcon = createIcon(<><path d="M16.438 4.938c.03-.43.418-.75.83-.75h1.482c.458 0 .83.372.83.83v14.404c0 .458-.372.83-.83.83h-1.482c-.412 0-.799-.32-.83-.75L17.25 4.938zM8.01 4.188c.03-.43.418-.75.83-.75h1.482c.458 0 .83.372.83.83v6.404c0 .458-.372.83-.83.83H8.84c-.412 0-.8-.32-.83-.75L8.01 4.188zM4.188 8.01c-.43.03-.75.418-.75.83v1.482c0 .458.372.83.83.83h6.404c.458 0 .83-.372.83-.83V8.84c0-.412-.32-.8-.75-.83L4.188 8.01z" /></>);
export const WavesIcon = createIcon(<path d="M2 6c.6.5 1.2 1 2.5 1S7 6.5 8 6s1.2-1 2.5-1 2.5.5 3.5 1.5c.9 1 1.5 1.5 2.5 1.5s1.5-.5 2-1" /><path d="M2 12c.6.5 1.2 1 2.5 1S7 12.5 8 12s1.2-1 2.5-1 2.5.5 3.5 1.5c.9 1 1.5 1.5 2.5 1.5s1.5-.5 2-1" /><path d="M2 18c.6.5 1.2 1 2.5 1S7 18.5 8 18s1.2-1 2.5-1 2.5.5 3.5 1.5c.9 1 1.5 1.5 2.5 1.5s1.5-.5 2-1" />);
export const ZapOffIcon = createIcon(<><path d="M12.41 6.75 13 2l-2.43 2.92" /><path d="M18.57 12.91 21 10h-5.34" /><path d="M8 8.92V4h.5a2 2 0 0 1 2 2v1" /><path d="M4.53 13.08 3 15h5.34" /><path d="M2 2l20 20" /></>);