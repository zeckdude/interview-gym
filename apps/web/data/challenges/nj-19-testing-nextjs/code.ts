export const starterTs = `interface TestPlan {
  serverComponent: boolean;
  routeHandlerAuth: boolean;
  middlewareRedirect: boolean;
  clientRouterMock: boolean;
}

function validateTestPlan(plan: TestPlan): boolean {
  return false;
}

export { validateTestPlan };`;

export const starterJs = `function validateTestPlan(plan): boolean {
  return false;
}

module.exports = { validateTestPlan };`;

export const solutionTs = `interface TestPlan {
  serverComponent: boolean;
  routeHandlerAuth: boolean;
  middlewareRedirect: boolean;
  clientRouterMock: boolean;
}

function validateTestPlan(plan: TestPlan): boolean {
  return plan.serverComponent && plan.routeHandlerAuth && plan.middlewareRedirect && plan.clientRouterMock;
}

export { validateTestPlan };`;

export const solutionJs = `function validateTestPlan(plan): boolean {
  return plan.serverComponent && plan.routeHandlerAuth && plan.middlewareRedirect && plan.clientRouterMock;
}

module.exports = { validateTestPlan };`;
