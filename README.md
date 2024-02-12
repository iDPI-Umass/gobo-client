# gobo-client
Javascript Universal HTTP Client for Interacting with GOBO API


## Testing

```bash
AWS_PROFILE=idpi environment='development' targets='all' node test/index.js
```

## Workbench Tasks

```bash
AWS_PROFILE=idpi npx gulp workbench --environment="client-task-development" --task=clearLastRetrieved --platform=all
```