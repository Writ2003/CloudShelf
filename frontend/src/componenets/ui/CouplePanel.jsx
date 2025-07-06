import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Copy, LinkIcon, RefreshCcw } from 'lucide-react'; // or MUI icons if you prefer
import { Button } from "./Button";

export default function CouplePanel({ bookId, onJoin }) {
  const [coupleId, setCoupleId] = useState('');
  const [inputId, setInputId] = useState('');

  useEffect(() => {
    const generated = nanoid(6);
    setCoupleId(generated);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupleId);
  };

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
        <Button variant="ghost" onClick={handleCopy}>
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      <div className="text-sm text-gray-500">
        Share this link: <br />
        <code className="break-all text-blue-600 underline">
          {window.location.origin}/read/{bookId}?coupleId={coupleId}
        </code>
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
