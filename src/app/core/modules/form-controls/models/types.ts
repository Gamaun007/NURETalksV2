export interface MenuAction<T = any> {
  translationKey?: string;
  translationKeyFactory?: (ctx?: T) => string;
  action?: (ctx?: T) => Promise<any> | any;
  displayCondition?: (ctx?: T) => boolean;
  disabledCondition?: (ctx?: T) => boolean;
  disabled?: boolean;
  value?: any;
  icon?: string;
  id?: string;
  iconColorMode?: 'stroke' | 'fill' | 'transparent';
  visibleFor?: string[];
}
