# Daily Scrum 3: 2026-10-21 16:21

**Attendees:** Aaleen (SM), William (PO), Marco, Rushan
**Sprint Goal:** A customer can browse a restaurant's menu and place a pickup order for a valid time, then follow its status while restaurant staff move it from Received to Completed.

## Progress toward the Sprint Goal

All the code for the Sprint Goal is now on main. Since Daily Scrum 2, PBI-06 (#58), PBI-13 (#59) and PBI-05 (#60) were merged last night.
A customer can browse the menu, build an order, place it for a valid pickup time and follow its status, while staff move it from Received to Completed. All 24 tests pass.

What is left is checking and closing it properly. There's the full flow check (#39), the Sprint Review and the Retrospective.

### Change request (since Daily Scrum 2)

After Daily Scrum 2, QuickBite sent a change request from several restaurant owners. The customers sometimes arrive much later than expected, and restaurants want customers to only choose pickup times they can realistically support given their current workload. William analyzed it with the team yesterday evening and the backlog was updated at 18:58:

- The request contains three different needs. The first one being a realistic preparation time per restaurant. The second limiting orders when the kitchen is busy. The third is customers arriving late (which limiting pickup times does not solve). Our questions for QuickBite are on the new backlog items.
- Only PBI-13 (#50) entered the sprint. Only about 1.5 hours, it only changes the pickup rule from PBI-04, in which Marco was free to do it, and it did not depend on any open question. It is now merged.
- The rest went to the Product Backlog. Where PBI-14 limit orders per pickup slot (#54), PBI-15 pause orders or add extra time (#55), PBI-16 preparation time from open orders (#56), PBI-17 pickup reminders (#57, Won't until QuickBite confirms late arrivals are a problem). They rank below staff sign-in (PBI-08), because only signed-in staff should change these settings.
- The Sprint Goal stayed the same: it already says "a valid time", and PBI-13 only makes valid stricter.

## Work to do next

| Who | Next |
|---|---|
| Rushan | Run the full flow check on main with William (#39). Review Marco's PBI-13 PR (#59). |
| Marco | Review Rushan's PBI-06 and PBI-05 PRs (#58, #60). |
| William | Run #39 with Rushan, accept the PBIs against their acceptance criteria, close the issues left open, and prepare the demo for the Sprint Review. |
| Aaleen | Prepare the Sprint Review and the Retrospective, take the board screenshots. |

## Impediments

- PR #58, #59 and #60 were merged last night without a review, which our Definition of Done requires. Two Daily Scrum edits were also pushed straight to main.
- Some issues stayed open because PRs were missing `Closes` lines: PBI-13 (#50) and its tasks (#51 to #53), and #37.

## Decisions and plan changes

- #58, #59 and #60 get reviewed now, as comments on the merged PRs. Anything they find is logged as a `defect` issue. We say in the report that these reviews happened after the merge.
- William closes the issues left open once he has checked each one against its acceptance criteria.
- No new work starts before the Sprint Review. Sprint Review after the full flow check (#39), then the Retrospective, where we discuss the missed reviews.
