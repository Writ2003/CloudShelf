import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Copy, LinkIcon, RefreshCcw } from 'lucide-react'; // or MUI icons if you prefer
import { Button } from "./Button";

export default function CouplePanel({ bookId, onJoin }) {
  const [coupleId, setCoupleId] = useState('');
  const [inputId, setInputId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const generated = nanoid(6);
    setCoupleId(generated);
  }, []);

  const handleCopyCoupleId = () => {
    navigator.clipboard.writeText(coupleId);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/read/${bookId}?coupleId=${coupleId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // Hide after 1.5s
  }

  const handleJoinWithInput = () => {
    if (inputId.trim()) {
      onJoin(inputId.trim());
    }
  };

  return (
    <div className="sticky top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-4 flex flex-col gap-4 transition-all">
      <h2 className="text-xl font-semibold">Couple Mode</h2>

      <div className="bg-gray-100 rounded-md p-3 flex items-center justify-between">
        <span className="font-mono text-lg">{coupleId}</span>
        <Button variant="ghost" onClick={handleCopyCoupleId}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-500 w-full p-4">
        <p className="font-medium mb-2">Share this link:</p>
        <button className='relative break-words break-all whitespace-normal text-sm font-normal cursor-pointer text-blue-500 underline' onClick={handleCopyLink}>
          {window.location.origin}/read/{bookId}?coupleId={coupleId}
          {/* Tooltip */}
          {copied && (
            <div className="absolute translate-x-full bg-black text-white text-xs rounded p-2 shadow-md">
              Copied!
            </div>
          )}
        </button>
      </div>

      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          const newId = nanoid(6);
          setCoupleId(newId);
        }}
      >
        <RefreshCcw className="w-4 h-4" /> Regenerate ID
      </Button>

      <hr />

      <p className="text-sm font-medium text-gray-600">Have a partner's code?</p>
      <div className="flex items-center gap-2">
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className="flex-1 border px-2 py-1 rounded-md text-sm outline-none"
          placeholder="Enter code"
        />
        <Button onClick={handleJoinWithInput}>
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
