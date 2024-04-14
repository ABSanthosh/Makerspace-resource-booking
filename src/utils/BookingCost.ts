import { EBillingType, type CartItem, type EInstance } from '@prisma/client';
import { getNumberOfSlots } from './AvailabilityRules';

export function bookingCost(
  items: (CartItem & {
    instance: EInstance;
  })[]
) {
  // if EBillingType is per session, just add all the instance costs and return
  // if EBillingType is per slot, take each instance cost and multiply by the number of slots
  return items.reduce((acc, item) => {
    const itemCost = item.instance.cost;
    const { slotSize } = item.instance.availability as {
      slotSize: number;
      start: string;
      end: string;
    };
    const noOfSlots = getNumberOfSlots({ slotSize, start: item.start, end: item.end });
    if (item.instance.billingType === EBillingType.PER_SESSION) {
      return acc + itemCost;
    } else if (item.instance.billingType === EBillingType.PER_SLOT) {
      return acc + itemCost * noOfSlots;
    }
    return acc;
  }, 0);
}
