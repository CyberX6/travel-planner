export type RouteRules = {
  allowLoops?: boolean;
  blockedPairs?: Array<{ from: string; to: string }>;
};

export function isBlocked(
  rules: RouteRules | null,
  fromId: string,
  toId: string
) {
  if (!rules) return false;

  return !!rules.blockedPairs?.some(p => p.from === fromId && p.to === toId);
}
