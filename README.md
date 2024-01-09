

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