const basic = async function ( $ ) {
  const { h } = $;
  let task;

  return [

    await h.test( "create test task", h.target( "task-basic", async () => {
      task = await $.gobo.tasks.post({ content: {
        queue: "default",
        name: "test",
        details: { value: await h.random() }
      }});      
    })),
  
  ];
};

export { basic }