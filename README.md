Simple pokemon card API.

Makes use of Node.JS and Express. Allows for CRUD functions with pokemon cards!

install dependencies and start the server!

GET /cards - returns all cards

?type=Type - filter by type
?minHP=HP - filter by minimum hp
?Rarity=Rarity - filter by rarity

GET /cards:id gets card by id

POST /cards - add a new card

PUT /cards:id - update a card

PATCH /cards:id - update parts of a card

DELETE /cards:id - delete a card

