# BG-CHATGPT-COORDINATOR--20261127T022200Z--LINT04
PROJECT=BEASTGAMES; MISSION_ID=BG-AAA-CLOSURE-20261126; WATCHER=OFFLINE; KYA_STATE=SELF_DECLARED.
Grant https://github.com/tk6209/beastGames/issues/32#issuecomment-7208048574. Base 61e9030fdd7814af4d60f0703dd876476d1ad046 (PR34 candidate, not merged).
RED: CI run 45927543849 job 140272333205 reports 287 errors/24 warnings. Four targeted errors: explicit any in sfx.ts and battleMusic.ts, empty interfaces in command.tsx and textarea.tsx.
CHANGE: use typed optional WebKit AudioContext constructor with explicit unsupported-browser return; replace empty interfaces with equivalent type aliases. No ESLint suppressions or economy/backend changes. Product head 9da0e4f08a8b12e0534aa45b8f45bb40a3aaa240.
TEST: require npm ci, unit/build/scoped lint and compare global baseline; expected four fewer errors, not yet verified. Independent review required. No deployment. Branch stacked on PR34 candidate to avoid broken npm lock baseline; integrate only after BG-00 review/merge and revalidate exact SHA.
