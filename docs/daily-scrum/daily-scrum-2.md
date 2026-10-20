# Daily Scrum 2: 2026-10-20 18:45

**Attendees:** Aaleen (SM), William (PO), Marco, Rushan
**Sprint Goal:** A customer can browse a restaurant's menu and place a pickup order for a valid time, then follow its status while restaurant staff move it from Received to Completed.

## Progress toward the Sprint Goal

The customer side is mostly on main. The restaurant list (PBI-01). The menu (PBI-02). Adding items to an order with its total (PBI-03) are merged on top of the API contract (#40) and the orders tables (#45). A customer can now browse the menu but the order wont be place. That will be done in PBI-04, which is open in PR #46. The status transitions for PBI-06 are written on #7 (#32), but there is no PR yet for the staff page (PBI-06) or the order status page (PBI-05).

## Work to do next

| Who | Next |
|---|---|
| Marco | Update PR #46 with main and fix the conflicts, get CI green, and answer William's review. Change the pickup rule if the change request needs it. |
| Rushan | Start PBI-06 (staff endpoints, tests and page), then PBI-05 (order status page). |
| William | Review PR #46 again once it is fixed and accept it. Close #25 once the order reaches the checkout on main. |
| Aaleen | Review Rushan's PRs when they are open. Keep the board up to date. |

## Impediments

- PR #46 (PBI-04) has conflicts with main, a failing CI check and a change request from William. Until it merges, no order can be placed from the app.
- PBI-06 and PBI-05 are the biggest part left (7 open tasks) and have not started.

## Decisions and plan changes

- Change request from QuickBite: TODO what was asked, and what William decided enters the sprint.
- TODO next Daily Scrum: after PBI-04 is merged, before the full flow check (#39).
