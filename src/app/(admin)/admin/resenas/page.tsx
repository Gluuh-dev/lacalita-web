import {requireUser} from '@/lib/auth';
import {getReviewsAdmin} from '@/lib/queries';
import AdminShell from '@/components/admin/admin-shell';
import ReviewsManager from './reviews-manager';

export default async function ResenasAdmin() {
  await requireUser();
  const reviews = await getReviewsAdmin();

  return (
    <AdminShell title="Reseñas">
      <ReviewsManager reviews={reviews} />
    </AdminShell>
  );
}
