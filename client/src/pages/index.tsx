import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Card from "@/components/card";
import { Post } from "../types";
import { Pagination } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

interface IFetchPost {
  posts: Post[];
  total: number;
}

export const getServerSideProps: GetServerSideProps<{ posts: IFetchPost }> =
  (async (context) => {
    const { query } = context;
    const page = query.page ? query.page.toString() : "1";
    const limit = process.env.NEXT_PUBLIC_POSTS_ON_PAGE || "10";
    const res = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URI +
        "/post?" +
        new URLSearchParams({
          page: page,
          limit: limit,
        }).toString()
    );
    const posts: IFetchPost = await res.json();
    return { props: { posts } };
  }) satisfies GetServerSideProps<{ posts: IFetchPost }>;

export default function Home({
  posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const totalPages = Math.ceil(posts.total / Number(process.env.NEXT_PUBLIC_POSTS_ON_PAGE));
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push({
      pathname: '/',
      query: { page: value },
    });
  };
  return (
    <main>
      <div className="w-full flex justify-between px-10 sm:px-16 md:px-20 bg-green-600">
        <Link
          className="text-lg cursor-pointer text-black hover:text-white hover:font-medium"
          href="/create-post/"
        >
          Create post
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-10 sm:px-16 md:px-20 py-[3vh]">
        {posts.posts.map((post, i) => (
          <Card key={i} post={post} />
        ))}
      </div>
      <Pagination
        count={totalPages}
        page={Number(router.query.page) || 1}
        onChange={handlePageChange}
        className="w-max mx-auto my-[5vh]"
        color="primary"
      />
    </main>
  );
}
