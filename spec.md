# Stress Relief Hub

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Landing page with a calming hero section introducing the platform
- Programs section with 4 program types: Meetup Program, Exercise Program, Social Gathering, Task Allocation
- Each program has a list of available sessions/events with title, description, date/time, and participant count
- Users can browse programs without logging in
- Authenticated users can register for a program session
- Authenticated users can create their own sessions under any program type
- My Sessions dashboard for logged-in users: view sessions they joined or created
- Task Allocation program: users can create tasks and assign them to themselves or others in a group session
- Participant count tracking per session
- Authorization (login/signup) for managing sessions

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend:
   - User authorization (login/signup)
   - Program types: enum (Meetup, Exercise, SocialGathering, TaskAllocation)
   - Sessions: create, list by program, get detail, join, leave
   - Tasks (for TaskAllocation sessions): create task, list tasks per session, mark complete
   - Participant management per session

2. Frontend:
   - Navigation bar with login/signup
   - Landing hero section
   - Programs overview page with cards for each program type
   - Session list page per program type
   - Session detail page: description, date/time, participants, join/leave button
   - Create session form (authenticated)
   - My Sessions dashboard
   - Task list within a TaskAllocation session (create, complete tasks)
