# CLUTCH

CLUTCH is a mobile esports application designed to help competitive gamers find suitable teammates, build teams, and discover coaches.

The project is being developed as a university Mobile Application Development final project. The application should be a real, runnable mobile application with a clear user flow, meaningful UI screens, navigation, user input, state management, persistent data, and Git version control.

## Project Goal

CLUTCH aims to solve a common problem in competitive gaming: players often have difficulty finding suitable teammates or coaches based on their game, rank, and role.

The first version of CLUTCH will focus on team finding and coach discovery.

Advanced AI gameplay analysis is NOT part of the first version. AI-powered gameplay analysis and personalized coaching recommendations may be added as future improvements.

## Target Users

The main target users are competitive and semi-competitive gamers who want to:

- Find teammates
- Find or join esports teams
- Search for players with compatible games, ranks, and roles
- Discover coaches
- View team and coach profiles

The application should be designed to support multiple competitive games rather than being limited to a single game.

Potential supported games include:

- League of Legends
- Valorant
- Counter-Strike
- Mobile Legends: Bang Bang
- Honor of Kings
- Wild Rift

## Main User Flow

The main user flow should be:

Login / Register
        ↓
Home
        ↓
Find Team
        ↓
Team Detail
        ↓
Apply to Team

A secondary flow should be:

Home
        ↓
Find Coach
        ↓
Coach Profile

## Planned Screens

The initial version should contain the following meaningful screens:

1. Login
2. Register
3. Home
4. Find Team
5. Team Detail
6. Find Coach
7. Coach Profile

Additional screens such as:

- User Profile
- My Team
- Create Team
- Settings

may be added later if needed.

## Core Features

### Authentication

Users should be able to:

- Register
- Log in
- Log out

### User Profile

A user profile may contain:

- Username
- Email
- Selected game
- Rank
- Preferred role/lane

### Team Finder

Users should be able to:

- Browse teams
- Filter teams
- View team information
- See the game's name
- See the team's rank
- See which roles the team is looking for
- Open a team detail page
- Apply to a team

### Coach Finder

Users should be able to:

- Browse coaches
- Filter or search coaches
- View coach profiles
- See the games they specialize in
- See their coaching specialties
- Request/contact a coach

## Planned Database Structure

The first database version should be simple and meaningful.

Possible tables:

### users

- id
- username
- email
- game
- rank
- role

### teams

- id
- team_name
- game
- rank
- description

### coaches

- id
- name
- game
- specialty
- description

### team_members

- id
- team_id
- user_id

### applications

- id
- team_id
- user_id
- status

The database structure can be adjusted during development if a better and simpler design is identified.

## Technology Stack

The planned technology stack is:

- React Native
- Expo
- JavaScript
- Expo Router
- Supabase
- Git
- GitHub
- VS Code

The project should remain simple and understandable. Avoid unnecessary libraries and unnecessary architectural complexity.

## UI / Design Direction

CLUTCH should have a modern esports-oriented mobile UI.

The design should be:

- Clean
- Modern
- Dark-themed
- Easy to navigate
- Consistent across screens
- Readable on mobile devices
- Suitable for competitive gaming

The UI should use reusable components where appropriate.

Spacing, button sizes, typography, colors, and layouts should remain consistent between screens.

## Development Principles

The project should be developed incrementally.

Do not attempt to implement every feature at once.

Recommended development order:

1. Project setup
2. Basic navigation
3. Login and Register screens
4. Home screen
5. Team Finder UI
6. Team Detail screen
7. Coach Finder UI
8. Coach Profile screen
9. Supabase integration
10. Authentication
11. Database integration
12. Team filtering
13. Team application functionality
14. Coach functionality
15. Error handling
16. Loading and empty states
17. UI polishing
18. Testing
19. Final documentation

## State Management

The application should use simple and understandable state management.

For example, selected:

- Game
- Rank
- Role

should be stored and used when filtering teams or players.

Avoid introducing a complex state management library unless it becomes necessary.

## Error Handling

The application should handle common situations gracefully.

Examples:

- Invalid login
- Empty forms
- No teams found
- No coaches found
- Network/database errors
- Loading states

Users should receive understandable messages instead of seeing crashes or blank screens.

## Git Workflow

The project must use Git throughout development.

Do NOT create one single commit at the end of the project.

Commits should represent meaningful development steps.

Examples:

- Initial project setup
- Create login screen
- Add registration screen
- Implement navigation
- Create home screen
- Add team finder
- Add team detail screen
- Connect Supabase
- Implement authentication
- Add team filtering
- Implement team application
- Add coach finder
- Improve error handling
- Polish UI

Commit messages should clearly explain what was changed.

## Academic Project Requirements

The application must:

- Be runnable
- Have at least 3 meaningful UI screens
- Have screen-to-screen navigation
- Have user input
- Use some form of state management
- Use persistent data/database meaningfully
- Have a clear target user group
- Solve a concrete problem
- Use Git throughout development
- Have a consistent UI

## Future Improvements

The following features are NOT required for the first version but may be considered later:

- AI gameplay analysis
- Personalized AI coaching recommendations
- Match performance analysis
- Advanced player matching
- Notifications
- In-app messaging
- Discord integration
- Tournament features
- Statistics and analytics
- Multi-language support

## Important Development Rule

CLUTCH must be developed as an original project.

Do not copy or clone an existing application or repository and make minor modifications.

Use external tutorials or documentation only as learning resources, and understand the code that is implemented.

The developer should be able to explain the application's code, architecture, database structure, and main user flow during the final presentation.

## Current Project Status

The project is currently at the initial setup stage.

The GitHub repository has been created and the repository has been cloned locally into a folder named:

CLUTCH

The next step is to set up the React Native / Expo application inside this repository and begin implementing the project incrementally.

Do not implement the entire application at once. Build and test each stage before moving to the next one.
