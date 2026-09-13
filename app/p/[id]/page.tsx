import { notFound } from "next/navigation";
import { sql, type Postcard } from "@/lib/db";
import { PostcardView } from "./PostcardView";

export default async function PostcardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rows = await sql`select * from postcards where id = ${id}`;
  const postcard = rows[0] as Postcard | undefined;

  if (!postcard) notFound();

  return <PostcardView postcard={postcard} />;
}
