import { notFound } from "next/navigation";
import { sql, type Postcard } from "@/lib/db";

export default async function PostcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await sql`select * from postcards where id = ${id}`;
  const postcard = rows[0] as Postcard | undefined;

  if (!postcard) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {postcard.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={postcard.image_url}
            alt=""
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-8">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-3">
            From {postcard.sender_email}
          </p>
          <p className="text-lg whitespace-pre-wrap leading-relaxed">
            {postcard.message}
          </p>
          <p className="mt-6 text-xs text-neutral-400">
            {new Date(postcard.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </main>
  );
}
