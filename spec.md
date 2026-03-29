# Corporate Wellness Hub

## Current State
The activity pages — MindfulMeetupPage, SocialGatheringPage, and TaskSharingPage — display activity cards with emoji, name, description, tags/vibes, and group size. Each card has no booking button; the only CTA is a footer button linking to the Programs page to create a session. The CreateSessionModal component accepts a `defaultType` and optionally a `defaultActivityName` (not yet implemented). The SessionCard already has a 'Sign in to Book' / 'Join' flow with Internet Identity.

## Requested Changes (Diff)

### Add
- A "Book This Activity" button on each activity card in MindfulMeetupPage, SocialGatheringPage, and TaskSharingPage
- When user is not authenticated: button says "Sign in to Book", clicking it triggers Internet Identity login via `login()` from `useInternetIdentity`
- When user is authenticated: button says "Book Activity", clicking it opens a pre-filled CreateSessionModal with the program type set and the activity name pre-filled in the session title
- The CreateSessionModal needs a new optional prop `defaultTitle` so activity name can be pre-filled

### Modify
- MindfulMeetupPage: Add Book button to each activity card
- SocialGatheringPage: Add Book button to each activity card  
- TaskSharingPage: Add Book button to each activity card
- CreateSessionModal: Accept optional `defaultTitle` prop and pre-fill the title field

### Remove
- Nothing removed

## Implementation Plan
1. Add `defaultTitle?: string` prop to CreateSessionModal and pre-fill the title state with it
2. In MindfulMeetupPage: import `useInternetIdentity`, add Book button to each activity card — unauthenticated shows "Sign in to Book" (triggers login), authenticated shows a dialog/modal trigger for CreateSessionModal with `defaultType={ProgramType.meetup}` and `defaultTitle={activity.name}`
3. Repeat for SocialGatheringPage (defaultType: socialGathering) and TaskSharingPage (defaultType: taskAllocation)
4. Validate and build
