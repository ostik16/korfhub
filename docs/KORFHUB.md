Complete system for live rich infotainment with granular level of detail. The main focus is to cover and track the information about a korfball match with varying levels of detail.

For MVP the coverage focuses on the core information of a match such as game state (time, period, score, teams). Later this will be extended to individual players such as substitution, their scoring percentage or individual infringements.

## Summary of the project
The intention of this project is to be able to track and display the information about a korfball match in real time to users. There should be two ways to consume the information from the users perspective. The first and main is to show the up-to-date information as an overlay on a livestream (scoreboard). The second is to show a text feed of events on a dedicated website with real time updates (hub).

With the scoreboard it is vital to display the information (mainly time) with the upmost precision and control it with as little delay as possible. This gives us few options on how to approach this.

On the other hand the hub can rely on some slower means of refreshing, either very simple  heartbeat, SSE or websocket sent messages on change.

Both the scoreboard and the hub will consume the same information but present them to the user in a different ways.

## Clarification
This document will solve and provide information on how to implement individual problems. It does not define individual tasks to be completed.

## System Overview
The diagram of the system is shown [[System overview.canvas|here]]

There are two individual servers. One of the servers ([[Scoreboard server]]) should be used only internally for controlling the scoreboard. It will handle and track the match time with upmost precision and as small delay as possible between click to action. The state of the game should be persisted to be easily restored in case of sudden outage. The main focus of this server is to precisely track the time of the game.

The second server ([[Data server]]) is storing all the data for the individual matches (including the match events, match statistics) and will be communicating with the internal tools. It will work with the [[Scoreboard UI]] to provide the team information (such as name, logo, color, ...) and events. It will also provide match data and receive inputs from the [[Scoreboard controller UI]] via its middleware to create individual events. The events are used as a nice touch up to the scoreboard widget, but also for the [[HUB UI]] to be presented to the user as a summary of the match.

Each match will also contain statistics. It can be either team-wide or player-specific depending on the provided information of the match. The statistics will be stored in similar way as events (tied to the match). The types of the statistic are: shot (score/miss), assist (on successful score), rebound (offensive/defensive, successful/unsuccessful), gain, loss. These statistics can then be presented in the HUB UI or as a game insight via the Scoreboard UI

The [[Scoreboard controller UI|Scoreboard controller]] will communicate via [[Scoreboard middleware]] to handle proper event creation depending on the level of detail of the match. When score action is triggered the middleware should send the information to the scoreboard server to increase the score and also to create an event in the data server. The detail of the event depends on the available information for that match (are there players to assign to the event?).

The controller should operate in different modes. One is just simple time and score tracking. Second is more advanced with tracking additional game events. Third is tracking of statistics only as this is very advanced mode and requires lot of attention and speed of input so the interface should be optimized for rapid, precise and detailed data capture. 
## Functional Requirements

**(MVP)** The main requirement is to track the game time in real time. This means users should be able to see and control it from multiple places at once. User should be able to set the game time and the period. In addition to this users should be able to track basic events such as score (home and away team), timeout, card, etc.

**(MVP)** User should be able to adjust the time by either subtracting or adding seconds to the time OR set the desired time.

**(NON-MVP)** Additionally when tracking events user should be able to select which player to associate the event to. This allows to introduce tracking of substitutions, which however requires the full list of players.

**(MVP)** User should be able to create individual matches in advance via API. Match consists of 2 teams, where each team has at least name, logo and two colors.

**(NON-MVP)** User should be able to create match via UI with or without the help of already created teams.

**(NON-MVP)** User can create individual teams and assign players to them. A team should have name, logo, color, category. This then can be used to create matches.

**(MVP)** User can watch the state of the game in a widget. It should display both teams and their score, the colors of the team and their logo, the current period and the remaining time.

**(NON-MVP)** The widget should recognize new events when the appear and display them with an animation. When more events appear, they should be queued.

**(MVP)** There should be detailed documentation

## Non-functional requirements

**(MVP)** Control the time of the game with minimal delay. Given that the time is stored globally on a server, it should be stopped in ~50ms. All other actions can be with bigger delay.

**(NON-MVP)** 



## Architecture design
### Technology stack
BUN
