'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { updateFullName } from '@/app/profile/actions';

interface EditableFullNameProps {
  currentName: string;
}

export default function EditableFullName({ currentName }: EditableFullNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentName);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setError('');
    startTransition(async () => {
      const result = await updateFullName(name);
      if (result.success) {
        setIsEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        setError(result.error || 'Failed to update');
      }
    });
  };

  const handleCancel = () => {
    setName(currentName);
    setIsEditing(false);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={100}
          disabled={isPending}
          className="text-sm font-medium text-foreground bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all w-48"
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="p-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all disabled:opacity-50"
          title="Save"
        >
          {isPending ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
          title="Cancel"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-sm font-medium text-foreground">{currentName || 'Not provided'}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/5 text-zinc-500 hover:text-foreground transition-all"
        title="Edit name"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      {showSuccess && (
        <span className="text-xs text-green-400 animate-pulse">Saved!</span>
      )}
    </div>
  );
}
