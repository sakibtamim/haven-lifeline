---
name: milestone-handoff
description: >-
  Standard operating procedure for milestone completion, cross-branch synchronization,
  stream drift monitoring, scoped visual verification, living contract updates,
  self-healing anti-pattern retrospectives, and clean operator conversation handoffs.
---

# Milestone Context Handoff & Agentic DevOps Skill

This skill governs the systematic handover procedure when an agent completes a milestone within the Sunshine Physio monorepo. It ensures zero context decay, clean branch convergence, cross-branch awareness across independent streams, empirical visual verification, and continuous self-improvement.

## When to Activate This Skill
- A roadmap milestone has reached completion (all production code and multi-tier tests written).
- The current conversation context has accumulated cognitive debt, token bloat, or more than 15 turns.
- The operator or agent decides it is time to land changes, verify state, and transition to a fresh conversation.

---

## Step 0: Pre-Planning Remote Tracking Audit (Mandatory Before Planning)
Before drafting any implementation plan, contract design, or writing code for a milestone:
1. **Fetch Remote State:** `git fetch origin`
2. **Audit Backend Branch:** `git log origin/main..origin/backend --oneline` (Inspect newly added routes, database migrations, or schema contracts).
3. **Audit Peer Streams:** `git log origin/main..origin/feat/* --oneline` (Verify peer stream progress).
4. **Contract vs Implementation Check:** Verify whether required contracts are already in `packages/shared` or in-flight on `origin/backend`. Never design or implement features based on stale local assumptions.
5. **Pre-Planning Digest:** Present a repository bulletin to the operator before writing code.

---

## Step 1: Pre-Handoff Automated Gates & Adversarial Verification
Before initiating any handoff or branch merge, execute all canonical validation gates:

1. **Unit & Integration Suites:**
   `pnpm test` (All packages must be 100% green).
2. **Monorepo Typecheck:**
   `pnpm typecheck` (All workspace projects must exit 0).
3. **End-to-End & Live Responsive Audits:**
   `pnpm test:responsive` (All 5 device viewports verified against live server).
   `pnpm test:e2e` (All user journeys passing).
4. **Production Bundling:**
   `pnpm build` (Next.js 16 App Router builds and prerenders cleanly).
   `pnpm --filter @sunshine/expo build:web` (Expo static web bundle exports cleanly with 0 extraneous route leaks).
5. **Subagent Adversarial Audit (Rule 7):**
   Invoke an independent reviewer subagent (`research` or `self`) with cognitive isolation to probe:
   - Anti-Homework Test Rule (tests must directly exercise exported product code; zero mock tautologies).
   - Expo Thin Route Rule (`apps/expo/app/` must contain only delegates <10 lines).
   - Error Swallowing (zero `2>/dev/null`, `|| true`, or empty `catch {}` blocks).

---

## Step 2: Remote Tracking & Active Branch Digest ("What's Happening Across the Repo")
Audit remote repository state and long-running branches:

1. **Fetch Remote Changes:**
   `git fetch origin`
2. **Inspect Current Branch Tracking:**
   `git log origin/main..HEAD --oneline` (Verify commits intended for landing).
   `git log HEAD..origin/main --oneline` (Check for newly landed commits on main).
3. **Digest All Active Branches:**
   List and inspect active branches:
   `git branch -r`
   - **Backend Branch (`origin/backend`):** Check `git log origin/main..origin/backend --oneline`. Identify newly added routes, database migrations, or schema updates.
   - **Peer Frontend Streams (`origin/feat/*`):** Check whether the other stream (e.g. Expo vs Web) has pushed new commits.
4. **Stream Drift Assessment:**
   - Compare the current milestone status of `apps/expo` vs `apps/web`.
   - If either stream is $\ge 1$ milestone ahead of the other, highlight this in the handoff briefing so the operator can coordinate stream prioritization.

---

## Step 3: Branch Convergence & Commit Hygiene (Rule 13)
1. **Short-Running Domain Branch Verification:**
   Ensure work is on a dedicated domain working branch (`<username>/<domain>`: `backend`, `frontend`, `expo`, `next`). NEVER name branches after transient features or milestones (`auth`, `booking`, `patient-dashboard`). Never commit directly to `main`.
2. **GPG Signed Commits:**
   Ensure all staged changes are committed using Conventional Commits with GPG signature (`git commit -S`).
3. **Branch Push:**
   Push feature branch to remote: `git push origin <branch-name>`.
4. **Landing to Main & Immediate Pruning (When Authorized by Operator):**
   - Switch to `main`: `git checkout main`
   - Pull latest: `git pull origin main`
   - Merge domain branch: `git merge --ff-only <branch-name>` (or rebase/merge as directed by operator)
   - Push to main: `git push origin main`
   - **Prune Merged Branch:** Immediately delete the merged branch locally and on remote (`git push origin --delete <branch-name> && git branch -d <branch-name>`) to eliminate dead branch trails and keep the active branch digest bulletin uncluttered.

---

## Step 4: Scoped Visual Verification Deliverables
Capture empirical visual proof that the delivered feature functions correctly:

1. **Dual-Stream Delivery (Both Touched):**
   - **Web:** Capture full-page screenshot of the feature page on `http://localhost:3000` (`test-results/screenshots/dual-stream/web-<feature>.png`).
   - **Expo Web:** Capture full-page screenshot on `http://localhost:8081` (`test-results/screenshots/dual-stream/expo-<feature>.png`).
2. **Single-Stream Delivery (Independent Ownership):**
   - If working on a dedicated Web or Expo feature branch, capture visual screenshots specifically for the modified application.
3. **Embed Artifacts:**
   - Reference the screenshots in `walkthrough.md` for immediate operator inspection.

---

## Step 5: Living Contracts Synchronization (Rule 10)
Synchronize the project's living governance documents:

1. **Roadmap (`docs/roadmap.md`):**
   - Mark completed milestone as `[COMPLETED]` with timestamp and verification metrics.
   - Update stream status (noting independent progress of Web or Expo).
   - Proactively promote the next Horizon 2 milestone into Horizon 1 (High Resolution), defining contracts, schemas, routes, and testing tiers.
2. **Decision Tree (`docs/design/03_backend_decision_tree.md`):**
   - Update any newly introduced endpoints, runtime workflows, or envelopes.
   - **Constraint:** Ensure total line count strictly remains under 50 lines.
3. **Testing Matrix (`docs/design/04_testing_matrix.md`):**
   - Ensure newly created test files or colocation requirements are accurately registered.

---

## Step 6: Adaptive Self-Healing Retrospective
Review deviations, friction points, or anti-patterns detected and corrected during the session:

1. **Identify Corrections Made:**
   - Did the agent break test colocation?
   - Did the agent create ad-hoc scripts instead of standard runners?
   - Did tests manufacture passes through synthetic mocks or local copies?
   - Did thick routes leak into Expo Router?
2. **Update Guidelines & Skills:**
   - Formulate a concrete invariant preventing the mistake.
   - Record the lesson in this skill or `AGENTS.md` under the appropriate rule.
3. **Learned Monorepo Invariants (Continuous Retrospective):**
   - **Indexed Date Boundaries:** Queries on temporal columns (e.g. `appointments.scheduledStart`) must always supply range boundaries (`gte(scheduledStart, dayStart)` and `lte(scheduledStart, dayEnd)`) to trigger composite index scans rather than full table memory loads.
   - **Domain Guardrails on State Reservation:** Ephemeral locking mechanisms (`acquireLock`) must validate domain state (non-past timestamps, non-overlapping active bookings in DB) before allocating tokens.
   - **Frontend Error Visibility:** Client network fetch catch blocks must never silently fallback to empty states (`catch { setSlots([]); }`); they must log diagnostics and render user-facing error banners.
   - **Lifecycle Token Cleanup:** Ephemeral hold tokens (`lockToken`) must be propagated into downstream mutation payloads (such as appointment creation) to explicitly clear holding locks upon successful commit.
   - **Short-Running Domain Branching Invariant:** Branches must strictly adhere to `<username>/<domain>` (`backend`, `frontend`, `expo`, `next`), never transient feature or milestone names (`auth`, `booking`, `patient-dashboard`). Upon landing to `main`, merged branches must be pruned immediately locally and remotely (`git push origin --delete <branch>` and `git branch -d <branch>`) to eliminate dead branch trails and keep the repository digest bulletin clean.
   - **Contract $\neq$ Implementation Invariant:** Frontend streams must never author runtime backend logic (`apps/api`, `packages/db`) to unblock UI progress. Symmetrically, backend streams must never author frontend UI screens. Streams must anchor exclusively to `packages/shared` contracts and decouple testing via typed mock factories.
   - **Bidirectional "First-to-the-Trophy" Protocol:** Whichever stream arrives first at a milestone scaffolds the contract in `packages/shared` and files a GitHub Issue with domain labels and owner assignment (`@smamun19` for backend, `@kuasha420` for frontend).
   - **Zero Type Suppression in Mock Factories:** Mock factories must strictly satisfy real Zod DTO types with realistic defaults, with zero `as any` or type-suppressing shortcuts. Once both ends land, Tier 5 integration tests must verify full live wire compatibility.
   - **Pre-Planning Remote Audit Mandate:** Never begin milestone implementation planning without fetching origin and auditing `origin/backend` and peer stream commits first.
   - **Defensive Execution Ceilings & Thenable Proxy Invariant:** Test commands executed in subagent sessions must always enforce shell-level execution ceilings (`timeout 180s ...`) to guard against worker deadlocks during module loading. Furthermore, dynamic proxies in test setup files (e.g. `apps/expo/test/setup.ts`) must explicitly guard against Promise `.then` resolution (`if (prop === 'then' || prop === '$$typeof') return undefined;`) to prevent V8 ESM dynamic import deadlocks.

---

## Step 7: Operator Handover Briefing & Fresh Conversation Launcher
Present a structured final handover report to the operator:

1. **Delivery Summary:**
   - Milestone name and status.
   - List of commits and PR link (or branch push status).
   - 100% green verification stats (Vitest, Typecheck, Playwright, Builds).
2. **Active Branches Digest ("What's Happening Across the Repo"):**
   - Status of `origin/backend`, `origin/feat/*`, and stream synchronization.
   - Flag any stream drift or external updates requiring operator attention.
3. **Visual Verification Proofs:**
   - Display or reference screenshots of the active stream(s).
4. **Fresh Conversation Scoped Prompt:**
   - Provide a concise, self-contained prompt ready for the operator to copy-paste into a new conversation, anchored on `docs/roadmap.md` for the promoted next milestone.
