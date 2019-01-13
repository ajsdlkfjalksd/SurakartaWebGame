# SurakartaWebGame
This project is the multiplayer online game of Surakarta based on Node.js(Express) and MongoDB.

The users can login to play online and check their play record.

Surakarta is a little-known Indonesian strategy board game for two players, named after the ancient city of Surakarta in central Java. The game features an unusual method of capture which is "possibly unique" and "not known to exist in any other recorded board game".

Rules

Players decide who moves first, then turns alternate. The object of the game is to capture all 12 of the opponent's pieces; or if no further captures are possible, to have more pieces remaining on the board than the opponent. Pieces always rest on the points of intersection of the board's grid lines. On a turn, a player either moves one of his pieces a single step to an unoccupied point in any direction (forwards, backwards, sideways, or diagonally), or makes a capturing move special to Surakarta.

Capturing move

A capturing move consists of traversing along an inner or outer circuit (colored blue or green in the illustration) around at least one of the eight corner loops of the board, followed by landing on an enemy piece, capturing it. Captured pieces are removed from the game. So, corner loop(s) are only used when making a capture. The capturing piece enters (and leaves) the circular loop via a grid line tangent to the circle. Any number of unoccupied points may be traveled over, before or after traversing a corner loop. An unoccupied point may be traveled over more than once during the capturing piece's journey. Only unoccupied points may be traveled over; jumping over pieces is not permitted. Capturing is always optional (never mandatory).

End of game

A game is won when a player captures all 12 of his opponent's pieces. If neither side can make headway, the game is ended by agreement and the winner is the player with the greater number of pieces remaining on the board.

Scoring

A match consists of more than one game. Players agree beforehand how the winner will be determined. A couple methods are typically used: Playing a fixed number of games Each game is scored by the number of pieces remaining at the end of the game. The winner is the player with higher total points after all games have finished. Playing to a fixed number of points New games are played until one player reaches or exceeds the winning point total.
