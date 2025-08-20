'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface MerchantDetailsData {
  merchantCode?: string;
  merchantName?: string;
  merchantAddress?: string;
  notificationEmail?: string;
  country?: 'GHANA';
  tinNumber?: string;
  orgType?: number;
  merchantCategory?: number;
  terminal?: string;
}

export interface SettlementDetailsData {
  settlementFrequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  surcharge?: 'Customer' | 'Merchant' | 'BOTH';
  partnerBank?: string;
  settlementAccount?: 'PARENT_BANK' | 'MERCHANT_BANK';
  totalSurcharge?: number;
  merchantPercentageSurcharge?: number;
  customerPercentageSurcharge?: number;
  surchargeCap?: number;
  surchargeHasCap: boolean;
}

export interface UserDetailsData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface BankDetailsData {
  merchantBank?: string;
  branch?: string;
  accountType?: 'CURRENT_ACCOUNT' | 'SAVINGS' | 'CALL_ACCOUNT';
  accountNumber?: string;
  accountName?: string;
}

export interface OvaDetailsData {
  mtnOva: {
    ovaUuid: string;
    telco: string;
  };
  airtelOva: {
    ovaUuid: string;
    telco: string;
  };
  telecelOva: {
    ovaUuid: string;
    telco: string;
  };
}

export interface MerchantOnboardingState {
  currentStep: number;
  completedSteps: number[];
  merchantDetails: MerchantDetailsData;
  settlementDetails: SettlementDetailsData;
  userDetails: UserDetailsData;
  bankDetails: BankDetailsData;
  ovaDetails: OvaDetailsData;
}

const initialState: MerchantOnboardingState = {
  currentStep: 1,
  completedSteps: [],
  merchantDetails: {
    country: 'GHANA',
  },
  settlementDetails: {
    settlementFrequency: 'MONTHLY',
    surcharge: 'Customer',
    settlementAccount: 'PARENT_BANK',
    totalSurcharge: 1.5,
    merchantPercentageSurcharge: 0,
    customerPercentageSurcharge: 0,
    surchargeHasCap: true,
  },
  userDetails: {},
  bankDetails: {
    accountType: 'CURRENT_ACCOUNT',
  },
  ovaDetails: {
    mtnOva: { ovaUuid: '', telco: 'mtn' },
    airtelOva: { ovaUuid: '', telco: 'airtel' },
    telecelOva: { ovaUuid: '', telco: 'telecel' },
  },
};

export const merchantOnboardingAtom = atomWithStorage<MerchantOnboardingState>(
  'merchant-onboarding',
  initialState
);

export const currentStepAtom = atom(
  (get) => get(merchantOnboardingAtom).currentStep,
  (get, set, step: number) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, { ...current, currentStep: step });
  }
);

export const completedStepsAtom = atom(
  (get) => get(merchantOnboardingAtom).completedSteps,
  (get, set, steps: number[]) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, { ...current, completedSteps: steps });
  }
);

export const merchantDetailsAtom = atom(
  (get) => get(merchantOnboardingAtom).merchantDetails,
  (get, set, data: Partial<MerchantDetailsData>) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, {
      ...current,
      merchantDetails: { ...current.merchantDetails, ...data },
    });
  }
);

export const settlementDetailsAtom = atom(
  (get) => get(merchantOnboardingAtom).settlementDetails,
  (get, set, data: Partial<SettlementDetailsData>) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, {
      ...current,
      settlementDetails: { ...current.settlementDetails, ...data },
    });
  }
);

export const userDetailsAtom = atom(
  (get) => get(merchantOnboardingAtom).userDetails,
  (get, set, data: Partial<UserDetailsData>) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, {
      ...current,
      userDetails: { ...current.userDetails, ...data },
    });
  }
);

export const bankDetailsAtom = atom(
  (get) => get(merchantOnboardingAtom).bankDetails,
  (get, set, data: Partial<BankDetailsData>) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, {
      ...current,
      bankDetails: { ...current.bankDetails, ...data },
    });
  }
);

export const ovaDetailsAtom = atom(
  (get) => get(merchantOnboardingAtom).ovaDetails,
  (get, set, data: Partial<OvaDetailsData>) => {
    const current = get(merchantOnboardingAtom);
    set(merchantOnboardingAtom, {
      ...current,
      ovaDetails: { ...current.ovaDetails, ...data },
    });
  }
);

// Helper atom to mark a step as completed
export const markStepCompletedAtom = atom(
  null,
  (get, set, step: number) => {
    const current = get(merchantOnboardingAtom);
    const completedSteps = [...current.completedSteps];
    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
      set(merchantOnboardingAtom, { ...current, completedSteps });
    }
  }
);

// Helper atom to check if we can navigate to a step
export const canNavigateToStepAtom = atom((get) => (targetStep: number) => {
  const { completedSteps, currentStep } = get(merchantOnboardingAtom);
  
  // Can always go to step 1
  if (targetStep === 1) return true;
  
  // Can go to current step
  if (targetStep === currentStep) return true;
  
  // Can go to next step if current step is completed
  if (targetStep === currentStep + 1 && completedSteps.includes(currentStep)) {
    return true;
  }
  
  // Can go to any completed step
  return completedSteps.includes(targetStep);
});

// Helper atom to reset the form
export const resetFormAtom = atom(
  null,
  (get, set) => {
    set(merchantOnboardingAtom, initialState);
  }
);