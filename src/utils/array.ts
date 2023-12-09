import _ from 'lodash';

export const recursiveMap = <T, U>(array: T[], iteratee: (item: T) => U, childrenKey: string = 'children'): U[] => {
  return _.map(array, node => {
    if (_.isArray((node as any)[childrenKey])) {
      return {
        ...iteratee(node),
        [childrenKey]: recursiveMap((node as any)[childrenKey], iteratee, childrenKey),
      } as U;
    } else {
      return iteratee(node);
    }
  });
}
