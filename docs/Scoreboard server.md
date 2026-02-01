Provides the current state: game time, period and score. 
It also has controls to safely modify the state in real time.

## Metadata
document version: 1
api version: 1
port: 8001

## Functional Requirements
### Controls
- Track and control time
	- start the time
	- stop the time
	- reset the time
	- adjust the time
	- set the time
	- decide if the time should count up or down
- Track and control period
	- set period text
	- set the period time limit
- Track and control score
	- increase/decrease home score
	- increase/decrease away score
	- reset score
- Quality of life
	- set home team name
	- set away team name
### Rules
- the time should not exceed the time limit
- the score cannot go to negative
### Time remaining calculation
In order to know how time time is remaining and return the most accurate time there are couple of options:

|                                                 | pros                                                                                                 | cons                                                                                                                                                                                                                                                           |     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| return timestamp since when the time is running | - allows for smoother experience on frontend<br>- does not rely on constant updates from the backend | - makes frontend more complex by forcing it to calculate the remaining time<br>- might have issues with timezone (this could be solved by cutting any extra time above time limit again increasing complexity)<br>- has to be done for every frontend instance |     |
| calculate the remaining time on request         | - no additional logic on frontend required                                                           | - depends on constant and frequent updates from backend<br>                                                                                                                                                                                                    | ✅   |
> Decision is to calculate the remaining time on the server due to the small complexity of implementation in comparison to calculating it on the frontend. This makes it much easier and more robust, if there shall be any future changes to the logic (such as changing if the time should count up or down)

Both of the approaches however require to know when was the timer started in order to calculate the remaining time. This timestamp will be created when a request to start the time was received.
Optionally the request can contain the timestamp when was the start triggered to remove the network delay (however this can introduce the issue with timezone, which is not that big of a problem). If the request to start the time contains the timestamp use it, otherwise create a new one. If new request to start timer, but the timer is running (because the timestamp is present, ignore that request)
### Endpoints
#### Time
- start
	- GET
- stop
	- GET
- reset
	- GET
- set
	- GET
	- query
		- time - number of seconds remaining
- adjust
	- GET
	- query
		- time - the amount to be added to the remaining time (can be negative)
#### Score
- home
	- GET
	- query 
		- score - the amount to be added to the home team score (can be negative)
- away
	- GET
	- query
		- score - the amount to be added to the away team score (can be negative)
- reset
	- GET
#### Period
- set
	- GET
	- query
		- name - name of the period
- limit
	- GET
	- query
		- time - the time limit of the period in seconds
#### Match
- set
	- GET
	- query
		- id - the id of a match to pull additional information for
- info
	- GET
	- returns
		- time_remaining - remaining time in ms
		- score_home
		- score_away
		- period
		- match_

### Persistence
The current state of the server should be saved to a persistent place, to prevent data loss in case of power outage or server crash. The data should be saved as often as needed (e.g. on each change it should be saved in the persistence store).

The persistence data can be store in a local JSON file to which the current state is written.

When the server is started it should always check for persistence store (file) before using default values.
## Non-Functional requirements
It should handle multiple concurrent connections each making 10 requests/second up to 100 requests per second. The expected number of users at once using this service is 3-5.

All requests will be on local network.

The response size is minimal <1kb.

