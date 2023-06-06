const crud = async function ( $ ) {
  const { h } = $;
  let post;

  return [

    await h.test( "create post", h.target( "post-crud", async () => {
      post = await $.gobo.posts.post({ content: {
        "source_id": 1,
        "base_url": "https://twitter.com",
        "platform_id": await h.random(),
        "title": "Post Title",
        "content": "Content Test",
        "author": "David Test",
        "url": await h.random(),
        "visibility": "public"
      }});

      $.conforms( "posts", "post", post );
    })),

    await h.test( "list posts", h.target( "post-crud", async () => {
      const posts = await $.gobo.posts.get();
      $.conforms( "posts", "get", posts );
    })),  

    await h.test( "get post", h.target( "post-crud", async () => {
      const _post = await $.gobo.post.get(post);
      h.assert.deepEqual( post, _post );
    })),

    await h.test( "update post", h.target( "post-crud", async () => {
      const _post = { ...post };
      _post.content = "Content Test Edited";
      
      post = await $.gobo.post.put( _post );

      h.partialEqual( _post, post, [
        "id",
        "source_id",
        "base_url",
        "platform_id",
        "title",
        "content",
        "author",
        "url",
        "visibility",
        "created"
      ]);

      h.assert( _post.updated < post.updated );
    })),

    await h.test( "delete post", h.target( "post-crud", async () => {
      await $.gobo.post.delete( post );
      await h.fail( 404, async function () {
        await $.gobo.post.get( post )
      });
    })),
  
  ];
};

export { crud }