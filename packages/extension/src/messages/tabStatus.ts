import { getMessage } from '@extend-chrome/messages';
import { TabStatus } from '../types/tabStatus';

export const [sendTabStatus, tabStatusStream] =
  getMessage<TabStatus>('tab-status');
