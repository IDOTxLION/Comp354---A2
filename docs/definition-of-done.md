# Definition of Done

A Product Backlog Item is **Done** only when every item below is true.

## Requirements
- [ ] Every acceptance criterion on the issue is met and checked off.
- [ ] The Product Owner (or the developer, against the written criteria) has tried the feature in the running app.

## Code and review
- [ ] Work was done on its own branch named after the PBI (e.g. `feature/pbi-02-view-menu`).
- [ ] A pull request links the issue (`Closes #N`) and fills in the PR template.
- [ ] At least one other team member reviewed and approved the pull request.
- [ ] Review comments are resolved (fixed, or answered with a reason).

## Testing
- [ ] New server logic has automated tests.
- [ ] New UI behaviour that the acceptance criteria depend on has a component test, or a manual test is written in the PR.
- [ ] All tests pass in CI..

## Integration
- [ ] The pull request is squash-merged into `main`.
- [ ] The app still starts from a fresh clone of `main` with `npm install` and `npm run dev`, using the seed data.
- [ ] No known defects in the feature. Any defect found but not fixed is logged as a new issue.

## Documentation and tracking
- [ ] README updated if setup steps, scripts or API endpoints changed.
- [ ] The issue is moved to **Done** on the project board.
