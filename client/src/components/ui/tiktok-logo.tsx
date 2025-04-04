import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export const TikTokLogo: React.FC<LogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M256 0C114.62 0 0 114.62 0 256s114.62 256 256 256 256-114.62 256-256S397.38 0 256 0z" fill="currentColor" />
      <path d="M366.9 132.47a104.91 104.91 0 0 1-40-69.49h-60.27v160.85c0 31.14-25.73 56.87-56.87 56.87s-56.87-25.73-56.87-56.87 25.58-56.87 56.87-56.87c5.86 0 11.12.91 16.2 2.48v-60.52a118.98 118.98 0 0 0-16.2-1.1c-65.93 0-119.76 53.82-119.76 119.75s53.83 120 119.76 120c65.93 0 119.75-53.82 119.75-119.75v-65.26a186.57 186.57 0 0 0 97.15 27.1v-57.95c-19.9 0-43.6-3.4-59.76-9.14z" fill="black" />
      <path d="M366.9 132.47a104.91 104.91 0 0 1-40-69.49h-60.27v160.85c0 31.14-25.73 56.87-56.87 56.87s-56.87-25.73-56.87-56.87 25.58-56.87 56.87-56.87c5.86 0 11.12.91 16.2 2.48v-60.52a118.98 118.98 0 0 0-16.2-1.1c-65.93 0-119.76 53.82-119.76 119.75s53.83 120 119.76 120c65.93 0 119.75-53.82 119.75-119.75v-65.26a186.57 186.57 0 0 0 97.15 27.1v-57.95c-19.9 0-43.6-3.4-59.76-9.14z" fill="black" />
    </svg>
  );
};

export const TikTokShopIcon: React.FC<LogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z"
        fill="currentColor"
      />
      <path
        d="M15.1 5.4c-1.1 0-2-.6-2.6-1.4H10v7.8c0 1.3-1.1 2.4-2.4 2.4-1.3 0-2.4-1.1-2.4-2.4S6.3 9.4 7.6 9.4c.3 0 .5 0 .7.1V6.9c-.2 0-.5-.1-.7-.1-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1c2.8 0 5.1-2.3 5.1-5.1V8.5c1.3.7 2.7 1.1 4.2 1.1V6.8c-.6 0-1.3-.2-1.8-.4c-1.3-.7-1-1 0 0z"
        fill="black"
      />
      <path
        d="M15.1 5.4c-1.1 0-2-.6-2.6-1.4H10v7.8c0 1.3-1.1 2.4-2.4 2.4-1.3 0-2.4-1.1-2.4-2.4S6.3 9.4 7.6 9.4c.3 0 .5 0 .7.1V6.9c-.2 0-.5-.1-.7-.1-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1c2.8 0 5.1-2.3 5.1-5.1V8.5c1.3.7 2.7 1.1 4.2 1.1V6.8c-.6 0-1.3-.2-1.8-.4z"
        fill="black"
      />
    </svg>
  );
};

export const TikTokShopBag: React.FC<LogoProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 9V7C17 4.24 14.76 2 12 2C9.24 2 7 4.24 7 7V9H4V21H20V9H17ZM9 7C9 5.34 10.34 4 12 4C13.66 4 15 5.34 15 7V9H9V7ZM18 19H6V11H18V19Z"
        fill="currentColor"
      />
      <path
        d="M12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16Z"
        fill="currentColor"
      />
    </svg>
  );
};