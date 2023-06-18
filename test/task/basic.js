const basic = async function ( $ ) {
  const { h } = $;
  let task;

  return [

    await h.test( "create test task", h.target( "task-basic", async () => {
      task = await $.gobo.tasks.post({ content: {
        queue: "test",
        name: "test",
        details: { value: await h.random() }
      }});      
    })),

    await h.test( "create error task", h.target( "task-basic", async () => {
      task = await $.gobo.tasks.post({ content: {
        queue: "test",
        name: "error",
        details: { value: await h.random() }
      }});      
    })),
  
  ];
};

export { basic }