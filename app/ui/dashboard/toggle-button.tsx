'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ToggleButtonProps {
  collapsed: boolean;
  pathname: string;
}

export default function ToggleButton({ collapsed, pathname }: ToggleButtonProps) {
  const handleClick = () => {
    const newPath = collapsed
      ? pathname.replace('collapsed=true', '')
      : `${pathname}${pathname.includes('?') ? '&' : '?'}collapsed=true`;
    window.location.href = newPath;
  };

  return (
    <button
      onClick={handleClick}
      className="absolute right-0 top-1/2 -mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 shadow-md hover:bg-gray-300"
    >
      {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
    </button>
  );
}
