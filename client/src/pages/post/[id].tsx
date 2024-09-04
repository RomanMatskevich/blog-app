import Link from "next/link";
import { CardMedia, Typography } from "@mui/material";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import type { Post } from "@/types";



export const getServerSideProps: GetServerSideProps<{ post: Post }> = (async (
  context
) => {
  const { query } = context;
  const res = await fetch(
    process.env.NEXT_PUBLIC_SERVER_URI + "/post/" + query.id
  );
  const post: Post = await res.json();
  return { props: { post } };
}) satisfies GetServerSideProps<{ post: Post }>;



export default function Post({
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!post) {
    return <p>Loading...</p>; // Handle loading state
  }
  const formattedDate = (new Date(post.createdAt)).toDateString();
  return (
    <div className="">
      <div className="w-full flex justify-between px-10 sm:px-16 md:px-20 bg-green-600">
        <Link
          className="text-lg cursor-pointer text-black hover:text-white hover:font-medium"
          href={`/create-post/${post._id}`}
        >
          Manage post
        </Link>
        <Link
          className="text-lg cursor-pointer text-black hover:text-white hover:font-medium"
          href="/"
        >
          Blog
        </Link>
      </div>
      <div className="px-10 sm:px-16 md:px-20 py-[2vh]">
        <div className="relative w-full overflow-hidden">
          <CardMedia
            component="img"
            height="140"
            image={process.env.NEXT_PUBLIC_SERVER_URI + '/' + post.image}
            alt="post image"
          />
        </div>
        <Typography variant="h2" className="py-[2vh]">
          {post.title}
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: post.description }} variant="h5" className="py-[2vh]"></Typography>
        <Typography className="w-full py-1.5 md:py-2.5 lg:py-4 outline-none" variant="h6">
          created: {formattedDate}
        </Typography>
      </div>
    </div>
  );
}
