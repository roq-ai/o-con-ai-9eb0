const mapping: Record<string, string> = {
  companies: 'company',
  'option-contracts': 'option_contract',
  predictions: 'prediction',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
