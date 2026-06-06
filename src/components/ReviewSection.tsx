'use client';

import { useState, useTransition } from 'react';
import StarRating from './StarRating';
import { submitReview, deleteReview } from '@/app/products/actions';

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  profile: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

interface ReviewSectionProps {
  productId: string;
  reviews: ReviewData[];
  currentProfileId: string | null; // null = not logged in
  averageRating: number;
  hasPurchased: boolean;
}

function RatingDistribution({ reviews }: { reviews: ReviewData[] }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

  return (
    <div className="space-y-2">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-3 text-sm">
          <span className="w-4 text-zinc-400 text-right">{star}</span>
          <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500/80 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="w-8 text-zinc-500 text-xs">{count}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewForm({
  productId,
  existingReview,
}: {
  productId: string;
  existingReview?: ReviewData;
}) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Pilih rating terlebih dahulu');
      return;
    }

    setError('');
    setSuccess('');
    startTransition(async () => {
      const result = await submitReview(productId, rating, comment);
      if (result.success) {
        setSuccess(existingReview ? 'Review berhasil diupdate!' : 'Review berhasil disimpan!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Gagal menyimpan review');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 mb-3">
          {existingReview ? 'Update Rating Anda' : 'Beri Rating'}
        </label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase font-bold text-zinc-500 mb-3">
          Komentar (Opsional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Bagikan pengalaman Anda..."
          maxLength={1000}
          rows={3}
          disabled={isPending}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all resize-none disabled:opacity-50"
        />
        <div className="text-right text-xs text-zinc-600 mt-1">{comment.length}/1000</div>
      </div>

      {error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="w-full h-12 rounded-xl bg-secondary text-white font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Menyimpan...' : existingReview ? 'Update Review' : 'Kirim Review'}
      </button>
    </form>
  );
}

function ReviewCard({
  review,
  isOwn,
}: {
  review: ReviewData;
  isOwn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);

  const handleDelete = () => {
    if (!confirm('Hapus review Anda?')) return;

    startTransition(async () => {
      const result = await deleteReview(review.id);
      if (result.success) {
        setDeleted(true);
      }
    });
  };

  if (deleted) return null;

  const date = new Date(review.createdAt);
  const formattedDate = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {review.profile.avatarUrl ? (
            <img
              src={review.profile.avatarUrl}
              alt={review.profile.fullName || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary text-sm font-bold">
              {(review.profile.fullName || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                {review.profile.fullName || 'Explorer'}
              </span>
              {isOwn && (
                <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-bold">
                  Anda
                </span>
              )}
            </div>
            {isOwn && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                title="Hapus review"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-xs text-zinc-600">{formattedDate}</span>
          </div>

          {review.comment && (
            <p className="text-sm text-zinc-300 leading-relaxed">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewSection({
  productId,
  reviews,
  currentProfileId,
  averageRating,
  hasPurchased,
}: ReviewSectionProps) {
  const existingReview = currentProfileId
    ? reviews.find(r => r.profile.id === currentProfileId)
    : undefined;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Reviews</h2>
        <span className="text-sm text-zinc-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Summary + Form Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Rating Summary */}
        <div className="rounded-3xl border border-white/5 bg-primary/20 p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-light italic text-foreground">
                {reviews.length > 0 ? averageRating.toFixed(1) : '—'}
              </div>
              <div className="mt-1">
                <StarRating rating={Math.round(averageRating)} size="sm" />
              </div>
              <p className="text-xs text-zinc-500 mt-1">{reviews.length} rating{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex-1 border-l border-white/5 pl-6">
              <RatingDistribution reviews={reviews} />
            </div>
          </div>
        </div>

        {/* Right: Review Form */}
        <div className="rounded-3xl border border-white/5 bg-primary/20 p-8 flex flex-col justify-center">
          {!currentProfileId ? (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-400">Login untuk memberikan review</p>
              <a
                href="/login"
                className="text-[10px] tracking-[0.2em] uppercase font-bold px-6 py-2.5 rounded-full border border-secondary bg-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all duration-500"
              >
                Login
              </a>
            </div>
          ) : hasPurchased || existingReview ? (
            <>
              <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-6 font-bold">
                {existingReview ? 'Edit Review Anda' : 'Tulis Review'}
              </h3>
              <ReviewForm productId={productId} existingReview={existingReview} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-7 h-7 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-400 max-w-xs leading-relaxed">
                Hanya pembeli terverifikasi dari produk ini yang dapat memberikan ulasan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="rounded-3xl border border-white/5 bg-primary/20 p-8 space-y-6">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-2 font-bold">Semua Review</h3>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              isOwn={review.profile.id === currentProfileId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/5 bg-primary/20 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-light">Belum ada review. Jadilah yang pertama!</p>
        </div>
      )}
    </div>
  );
}
