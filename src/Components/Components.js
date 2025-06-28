import React, { useEffect, useState } from "react";

import Header     from "./layout/Header";
import Footer     from "./layout/Footer";
import Spinner    from "./shared/Spinner";
import PostForm   from "./posts/PostForm";
import PostList   from "./posts/PostList";
import PostDetail from "./posts/PostDetail";

import {
  fetchPostsWithAuthor,
  createPost
} from "./../services/post";

/* ---------------------------------------------------------------------------
   data-down, event-up:
   – child components receive plain props
   – state-changing callbacks all live here
--------------------------------------------------------------------------- */
export default function Components() {
  const [posts,    setPosts]    = useState(null);   // all posts (+ user)
  const [selected, setSelected] = useState(null);   // currently opened post id

  /* initial fetch */
  useEffect(() => {
    fetchPostsWithAuthor().then(setPosts);
  }, []);

  /* add a new post */
  async function handleAdd(raw) {
    const withUser = {
      ...raw,
      user: { id: 1, firstName: "Jane", lastName: "Doe" }   // TODO auth ctx
    };
    const saved = await createPost(withUser);
    setPosts([saved, ...(posts ?? [])]);
  }

  /* search stub */
  const handleSearch = term =>
    console.log("Search not implemented yet. Key:", term);

  const goHome = () => setSelected(null);

  if (!posts) return <Spinner />;

  return (
    <>
      <Header onHome={goHome} onSearch={handleSearch} />

      <main className="container">
        {selected ? (
          <PostDetail id={selected} onBack={goHome} />
        ) : (
          <>
            <PostForm onAdd={handleAdd} />
            <PostList posts={posts} onSelect={setSelected} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
