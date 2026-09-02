---
name: make-a-pr
description: Run local checks, rebase the current branch onto latest main, push, open a PR with gh, and watch CI until it passes (fixing and re-pushing if it fails). Use whenever the user says "make a PR", "open a PR", or "ship this" for work in this repo.
---

# make-a-pr

Turns whatever is currently changed/committed into a mergeable, CI-green PR. Do the steps yourself — do not just describe them.

## 0. Figure out what branch this belongs on

Check `git status` and `git branch --show-current`. This repo is one-branch-per-feature: don't stack unrelated work onto whatever branch happens to be checked out.

- If the current branch's existing commits/PR are about the same feature as the new changes, stay on it.
- If the current changes are a **different, unrelated** feature from what the current branch is for (e.g. an unrelated bug fix discovered while working on a feature branch), move them off:
  ```bash
  git stash push -u -m "<description>" -- <changed files>
  git checkout main && git pull --ff-only origin main
  git checkout -b <new-branch-name>
  git stash pop
  ```
  Then switch back to the original branch when done, so the user isn't left somewhere unexpected.
- If there's no existing feature branch at all, branch off latest `main`.

Ask yourself this before running any commands — getting it wrong means re-doing the branch surgery afterward.

## 1. Run local checks — fix anything red before pushing

```bash
npx tsc --noEmit
npx eslint .
npm run build
```

All three must be clean (build succeeding, no new lint errors — pre-existing warnings unrelated to your change are fine to leave). Fix any failures and re-run before moving on. Don't skip `npm run build` — it catches things `tsc --noEmit` alone misses (e.g. static generation errors).

## 2. Rebase onto latest main

Before opening the PR, make sure the branch is current:

```bash
git fetch origin main
git rebase origin/main
```

If conflicts come up, resolve them, `git add` the resolved files, `git rebase --continue`. Re-run step 1's checks after a rebase that touched any files the checks cover.

## 3. Commit, push, open the PR

- Stage only the relevant files (never blanket `git add -A` without reviewing `git status` first).
- Commit with a message explaining *why*, not just what.
- Push with `-u`:
  ```bash
  git push -u origin <branch-name>
  ```
  (Use `--force-with-lease` instead of a plain push only if the rebase in step 2 actually rewrote already-pushed commits, and only after telling the user.)
- Open the PR:
  ```bash
  gh pr create --title "<short title>" --body "$(cat <<'EOF'
  ## Summary
  - ...

  ## Test plan
  - [ ] ...
  EOF
  )"
  ```

## 4. Watch CI until it resolves

Poll instead of guessing:

```bash
gh pr checks <PR#> --json name,bucket
```

Use the Monitor tool with an until-loop so you're not blocking on sleeps:

```bash
while true; do
  s=$(gh pr checks <PR#> --json name,bucket 2>/dev/null)
  if [ -n "$s" ] && jq -e 'all(.bucket!="pending")' <<<"$s" >/dev/null 2>&1; then
    jq -r '.[] | "\(.name): \(.bucket)"' <<<"$s"
    break
  fi
  sleep 10
done
```

- **All pass** → tell the user the PR is green and ready, with the PR URL.
- **Any fail** → pull the failing job's logs (`gh run view <run-id> --log-failed`), diagnose, fix the actual cause (not by disabling the check), commit, push, and go back to watching CI. Don't declare done on a red pipeline.

## Notes

- Never merge without the user asking explicitly — this skill's job ends at "PR open, CI green," not at "merged."
- If local checks can't fully validate the change (e.g. a feature needs live credentials this sandbox doesn't have), say so explicitly in the PR body's test plan and in your summary to the user — don't imply it was verified when it wasn't.
