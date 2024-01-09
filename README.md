

## ToDo
- [ ] Change equipment schema
- [ ] Add equipment category
- [ ] Add multiple types 

For each equipment
- *Generic Name eg: 3d printer
- *make and model
- *description
- *image
- videos

For each item
- *name
- *description
- *cost
- manuals
- status: operational, down-for-maintenance, out-of-service

Equipment categories (as editable)
- 3d printer
- CNC (laser cutter)
- welding
- Hand power tools
- hand tools
- Design station
- testing eqquipment
- PCB design 
- standalone Power tools

Electronic repository (loanables)
- *quantity
- *make and model
- *loaned quantity
- *image
- description

Material repository (consumables)
- *name
- *quantity
- *dimensions
  - *type: length, area, volume, breadths
  - *value
  - *unit: need the list of possible units 
- description

Supabase dashboard: http://localhost:54323/

- API URL: http://127.0.0.1:54321
- GraphQL URL: http://127.0.0.1:54321/graphql/v1
- DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- Studio URL: http://127.0.0.1:54323
- Inbucket URL: http://127.0.0.1:54324
- JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
- anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
- service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU