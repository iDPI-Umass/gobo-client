const crud = async function ( $ ) {
  const { h } = $;
  let task;

  return [

    await h.test( "create task", h.target( "task-crud", async () => {
      task = await $.gobo.tasks.post({ content: {
        queue: "test",
        name: "test",
        details: { value: await h.random() }
      }});
      
      $.conforms( "tasks", "post", task );
    })),

    await h.test( "list tasks", h.target( "task-crud", async () => {
      const tasks = await $.gobo.tasks.get();
      $.conforms( "tasks", "get", tasks );
    })),  

    await h.test( "get task", h.target( "task-crud", async () => {
      const _task = await $.gobo.task.get(task);
      h.assert.deepEqual( task, _task );
    })),

    await h.test( "update task", h.target( "task-crud", async () => {
      const _task = { ...task };
      _task.details = { value: await h.random() };
      
      task = await $.gobo.task.put( _task );

      h.partialEqual( _task, task, [
        "id",
        "queue",
        "name",
        "details",
        "created"
      ]);

      h.assert( _task.updated < task.updated );
    })),

    await h.test( "delete task", h.target( "task-crud", async () => {
      await $.gobo.task.delete( task );
      await h.fail( 404, async function () {
        await $.gobo.task.get( task )
      });
    })),
  
  ];
};

export { crud }