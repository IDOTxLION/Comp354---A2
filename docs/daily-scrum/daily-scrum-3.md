# Daily Scrum 3: 2026-10-20 19:20

**Attendees:** Aaleen (SM), William (PO), Marco, Rushan
**Sprint Goal:** A customer can browse a restaurant's menu and place a pickup order for a valid time, then follow its status while restaurant staff move it from Received to Completed.

## Progress toward the Sprint Goal

Most of the Sprint Goal is on main. PBI-01 to PBI-04 and PBI-06 are merged: a customer can browse a menu, build an order and place it for a valid pickup time, and staff can move the order from Received to Completed on the staff page. PBI-13 (#50), the part of the QuickBite change request taken into the sprint, is also merged: each restaurant now has its own preparation time instead of the fixed 15 minutes, and the checkout page shows it. The only part of the goal left is the customer following the status of their order (PBI-05).

## Work to do next

| Who | Next |
|---|---|
| Rushan | Finish the order status page (PBI-05) and open the PR. Then run the full flow check on main with William (#39). |
| Marco | Review Rushan's PBI-05 PR. Then help test the full flow, including the new preparation times. |
| William | Accept PBI-05. Run the full flow check with Rushan, then prepare the demo for the Sprint Review. |
| Aaleen | Review Rushan's PBI-05 PR. Prepare the Sprint Review and the Retrospective, and take the board screenshots. |

## Impediments

- None. PBI-05 only needs the order endpoint from PBI-06, which is merged.

## Decisions and plan changes

- The Sprint Goal is on track. No new work starts before the Sprint Review.
- The rest of the change request (PBI-14 to PBI-17) stays in the Product Backlog.
- Anything broken found in the full flow check is logged as a `defect` issue. William decides if it is fixed before the Sprint Review or goes back to the Product Backlog.
- Sprint Review once the full flow check (#39) passes, then the Retrospective.
