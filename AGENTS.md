# Project Haven Engineering Guidelines & Agent Invariants

<!-- SPDX-License-Identifier: Apache-2.0 -->
<!-- Copyright (c) 2026 Sakib Tamim & Project Haven Contributors -->

Welcome to **Project Haven (Haven Crisis Platform)**. These operational rules govern all human and autonomous AI engineering activities within this repository.

---

## 1. Safety, Clinical & Zero-PII Invariants (Non-Negotiable)

1. **Zero PII Logging & Zero Transit**:
   - Never log user chat content, IP addresses, location data, or phone numbers to disk, stdout, or remote monitoring services.
   - All session transcripts exist purely in ephemeral volatile memory and are purged upon session termination.
2. **Clinical & De-escalation Integrity**:
   - The mission is suicide crisis de-escalation, nervous system regulation, and immediate connection to accredited life-saving resources.
   - Never mock, bypass, or weaken crisis triage algorithms or emergency hotline selectors.
   - Emergency hotline phone numbers and SMS shortcodes must remain verifiable, valid, and immediately clickable (1-tap).
3. **Telemetry Denylist Rule**:
   - This repository is permanently barred from being synced to external or central telemetry aggregators (`~/.config/agyis/config.json`).

---

## 2. Universal Automated Verification Standard

1. **Mandatory Automated Verification**:
   - Always run the project test suite (`pnpm test`) before approving or committing any phase.
   - All tests must pass with clean exit code 0.
2. **Sub-Second Test Execution**:
   - Unit tests must complete within $< 1.0\text{s}$. Avoid network calls or unbounded sleeps in verification loops.
3. **No Error Swallowing**:
   - Empty `catch {}` blocks, `|| true`, and error silencing (`2>/dev/null`) are strictly prohibited in application code.

---

## 3. Architectural Boundary Standard

1. **Monorepo Separation**:
   - `@haven/web` (`apps/web`): Next.js 15+ App Router, Tailwind CSS v4, shadcn/ui. Client-side crisis calming tools.
   - `@haven/api` (`apps/api`): Hono low-latency API routes for SSE chat streaming & SMS webhooks.
   - `@haven/shared` (`packages/shared`): Shared schemas (Zod) and emergency hotline catalog.
   - `@haven/tokens` (`packages/tokens`): Design tokens and calming palette definitions.
   - `@haven/db` (`packages/db`): Drizzle ORM client, schemas, and migrations.
2. **Security & Shell Attack Immunity**:
   - Zero `child_process.exec`, zero shell invocations, and zero PHP dependencies anywhere in the project.
