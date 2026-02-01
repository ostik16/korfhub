
Processes and validates requests regarding games. It stores and serves the information about all games and its events.

## Metadata
document version: 1
api version: 1
port: 8002

## Functional requirements
### Players
Players are used for advanced event creation and for statistics tracking. Creating a player requires to specify the name, gender and number. Each player can have multiple numbers to account for the fact that he can play in multiple teams and categories. Player should also store the teams played in to allow for easier match creation and create history for the player.
Players are then assigned to individual matches based on their previous matches/team history.
### Teams
Creating a team is required to create a match. The minimal information for a team is name, logo, 2 colors and category.
Teams are then stored to allow easier creation of matches by only referencing the team id or slug.
Each team when created should have a unique slug in the scope of the teams. The slug should be constructed in a following way: `{category}-{team}-{index}`
### Matches
Match can be creating by specifying the two competing teams. Optionally each team can have roster of 16 players (8 men, 8 women) specified to enable advanced events and statistics. If not specified only the basic event creation and statistics tracking is available instead.
Match will be updated as it is being played adding events. Each match will have a list of events
### Events
Event is a notable action in the game such as score, timeout, start of the match, end of quarter, halftime, end of the match, substitution and card. Depending on the event type a player(s) can be assigned to it if they are available in the match.


### Controls
- Manage teams
	- create a team
	- update a team
		- name
		- logo
		- colors
- Manage matches
	- create a match
	- update a match
- Manage events
	- create an event
	- update an event
- Manage players 