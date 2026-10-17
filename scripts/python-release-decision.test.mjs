import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pythonReleaseDecision} from './python-release-decision.mjs';
test('release requires both execution and complete mathematical glyph rendering',()=>{
 assert.deepEqual(pythonReleaseDecision({status:'passed',cells:[{outputs:[{type:'stream',text:'ok'}]}]}),{status:'enabled',reason:''});
 const blocked=pythonReleaseDecision({status:'passed',cells:[{outputs:[{type:'stream',name:'stderr',text:'UserWarning: Glyph 7819 (LATIN SMALL LETTER X WITH DOT ABOVE) missing from current font.'}]}]});
 assert.equal(blocked.status,'code');assert(blocked.reason.includes('ẋ'));assert(blocked.reason.includes('U+1E8B'));
 assert.deepEqual(pythonReleaseDecision({status:'code',reason:'needs cvxpy',cells:[]}),{status:'code',reason:'needs cvxpy'});
});
