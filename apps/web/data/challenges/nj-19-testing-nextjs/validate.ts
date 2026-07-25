import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<(plan: { serverComponent: boolean; routeHandlerAuth: boolean; middlewareRedirect: boolean; clientRouterMock: boolean }) => boolean>(exports, 'validateTestPlan');
const t1 = fn({ serverComponent:true, routeHandlerAuth:true, middlewareRedirect:true, clientRouterMock:true }) === true;
const t2 = fn({ serverComponent:true, routeHandlerAuth:false, middlewareRedirect:true, clientRouterMock:true }) === false;
return { passed: t1&&t2, results: [
  { description: 'Complete plan passes', expected: 'true', actual: String(fn({ serverComponent:true, routeHandlerAuth:true, middlewareRedirect:true, clientRouterMock:true })), passed: t1 },
  { description: 'Missing route handler auth fails', expected: 'false', actual: String(fn({ serverComponent:true, routeHandlerAuth:false, middlewareRedirect:true, clientRouterMock:true })), passed: t2 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
