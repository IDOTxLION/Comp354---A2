# Daily Scrum 1: 2026-10-20 16:30

**Attendees:** Aaleen (SM), William (PO), Marco, Rushan
**Sprint Goal:** A customer can browse a restaurant's menu and place a pickup order for a valid time, then follow its status while restaurant staff move it from Received to Completed.

## Progress toward the Sprint Goal

None of it is implemented yet, this is to make sure everything is in place. The project setup (PBI-07) is merged, so the app runs and CI works. Sprint Planning is done, we have 7 PBIs on the Sprint 1 milestone, split into 24 tasks with its owners. William opened PR #40 with the API contract (`docs/api.md`), which defines how our parts connect. It is waiting for Marco to confirm the order format.

## Work to do next

| Who | Next |
|---|---|
| Marco | Confirm the order request format on PR #40. Then add the orders tables (#28) in a small PR so the order work can start on top of them. |
| Aaleen | Agree the "Closed" rule with William (#16), then the restaurant list endpoint and page (PBI-01). |
| William | Merge PR #40 once Marco confirms. Answer #16 and #27. Start the order context for PBI-03 while PBI-02 is in progress. |
| Rushan | Write the status transitions on #7 (#32), then start the endpoints (PBI-06) against the docs. Tests insert orders directly, so only the tables (#28) are needed. |

## Impediments

- Everything depends on PR #40 and then on the orders tables (#28). We need to get these done before anyone else can start.

## Decisions and plan changes

- PR #40 merges first, then #28. Everyone else starts coding now instead of waiting, using `docs/api.md` to confirm the layout.
- William comments "Accepted" on each PR after checking it against the acceptance criteria, before it is merged.
- Next Daily Scrum at 20:00.
