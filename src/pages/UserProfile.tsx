import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/user.service';
import { UserPublicProfile, Review } from '../types/models';
import { useAuthStore } from '../store/useAuthStore';

export const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  
  const [profile, setProfile] = useState<UserPublicProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProfileAndReviews(id);
    }
  }, [id]);

  const loadProfileAndReviews = async (userId: string) => {
    setLoading(true);
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        userService.getUser(userId),
        userService.getUserReviews(userId)
      ]);
      if (profileRes.success && profileRes.data) setProfile(profileRes.data);
      if (reviewsRes.success && reviewsRes.data) setReviews(reviewsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      const response = await userService.createReview(id, { rating, comment });
      if (response.success) {
        setReviewStatus('Recensione aggiunta!');
        setComment('');
        loadProfileAndReviews(id); // Reload
      } else {
        throw new Error(response.error?.message);
      }
    } catch (err: any) {
      setReviewStatus(`Errore: ${err.message}`);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Caricamento profilo...</div>;
  if (!profile) return <div className="p-10 text-center text-red-500">Utente non trovato.</div>;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 xl:p-12 py-10">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 mb-8 flex items-center gap-6">
        <div className="w-24 h-24 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center text-3xl font-bold">
           {profile.first_name[0]}{profile.last_name[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h1>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
              {profile.is_tutor ? 'Tutor' : 'Studente'}
            </span>
            {profile.average_rating && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                ★ {profile.average_rating}
              </span>
            )}
          </div>
          {profile.bio && <p className="text-gray-600 mt-4">{profile.bio}</p>}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recensioni ({reviews.length})</h2>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic bg-gray-50 p-6 rounded-xl border border-gray-200">Nessuna recensione presente.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900 text-sm">Utente Anonimo</span> {/* Il backend dovrebbe popolare il nome */}
                  <span className="text-amber-500 font-bold">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                </div>
                {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                <p className="text-gray-400 text-xs mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && user.id !== id && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Lascia una recensione</h3>
          {reviewStatus && <div className="mb-4 text-sm font-medium text-violet-700">{reviewStatus}</div>}
          
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 ml-1">Voto (1-5)</label>
              <input 
                type="number" min="1" max="5" 
                value={rating} onChange={e => setRating(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-600 focus:ring-2 mt-1"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 ml-1">Commento</label>
              <textarea 
                value={comment} onChange={e => setComment(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-600 focus:ring-2 mt-1 min-h-[80px]"
              />
            </div>
            <button type="submit" className="px-6 py-2.5 bg-violet-700 text-white font-semibold rounded-xl hover:bg-violet-800 transition-colors">
              Invia Recensione
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
