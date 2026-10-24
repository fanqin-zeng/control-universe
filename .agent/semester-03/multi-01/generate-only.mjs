// Canonical artifact generation for a rebased snapshot; never acceptance.
// Reuses the repository's generator unchanged, omitting the expensive H2 audit
// in this throwaway module. Full unmodified npm run check remains mandatory.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const source=fs.readFileSync('scripts/check-catalog.mjs','utf8');
const a=source.indexOf('// ============================================================ 6. subsections'),b=source.indexOf('// ============================================================ 7. OUTLINE');
assert(a>0&&b>a);
const temporary='scripts/.rank9-generate-only.mjs';
try {
 fs.writeFileSync(temporary,source.slice(0,a)+source.slice(b));
 const result=spawnSync(process.execPath,[temporary,'--fix-outline','--fix-tracker-stats'],{encoding:'utf8'});
 if(result.error)throw result.error;
 assert(fs.existsSync('OUTLINE.md'));
 console.log('Canonical OUTLINE/tracker generation only; this does NOT count as an acceptance check.');
} finally {if(fs.existsSync(temporary))fs.unlinkSync(temporary);}
