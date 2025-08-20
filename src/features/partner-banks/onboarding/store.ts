'use client';

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface BasicDetailsData {
  name?: string;
  email?: string;
  logo?: File;
}

export interface CommissionDetailsData {
  commissionBankName?: string;
  commissionAccountName?: string;
  commissionAccountNumber?: string;
  commissionRatio?: number;
}

export interface SettlementDetailsData {
  settlementBankName?: string;
  settlementAccountName?: string;
  settlementAccountNumber?: string;
  crSampleFile?: File;
  drSampleFile?: File;
}

export interface ConfigurationData {
  headers?: string[];
}

export interface PartnerBankOnboardingState {
  currentStep: number;
  completedSteps: number[];
  basicDetails: BasicDetailsData;
  commissionDetails: CommissionDetailsData;
  settlementDetails: SettlementDetailsData;
  configuration: ConfigurationData;
}

const initialState: PartnerBankOnboardingState = {
  currentStep: 1,
  completedSteps: [],
  basicDetails: {},
  commissionDetails: {
    commissionRatio: 0,
  },
  settlementDetails: {},
  configuration: {
    headers: ['Authorization', 'Content-Type'],
  },
};

export const partnerBankOnboardingAtom = atomWithStorage<PartnerBankOnboardingState>(
  'partner-bank-onboarding',
  initialState
);

export const currentStepAtom = atom(
  (get) => get(partnerBankOnboardingAtom).currentStep,
  (get, set, step: number) => {
    const current = get(partnerBankOnboardingAtom);
    set(partnerBankOnboardingAtom, { ...current, currentStep: step });
  }
);

export const completedStepsAtom = atom(
  (get) => get(partnerBankOnboardingAtom).completedSteps,
  (get, set, steps: number[]) => {
    const current = get(partnerBankOnboardingAtom);
    set(partnerBankOnboardingAtom, { ...current, completedSteps: steps });
  }
);

export const basicDetailsAtom = atom(
  (get) => get(partnerBankOnboardingAtom).basicDetails,
  (get, set, data: Partial<BasicDetailsData>) => {
    const current = get(partnerBankOnboardingAtom);
    set(partnerBankOnboardingAtom, {
      ...current,
      basicDetails: { ...current.basicDetails, ...data },
    });
  }
);

export const commissionDetailsAtom = atom(
  (get) => get(partnerBankOnboardingAtom).commissionDetails,
  (get, set, data: Partial<CommissionDetailsData>) => {
    const current = get(partnerBankOnboardingAtom);
    set(partnerBankOnboardingAtom, {
      ...current,
      commissionDetails: { ...current.commissionDetails, ...data },
    });
  }
);

export const settlementDetailsAtom = atom(
  (get) => get(partnerBankOnboardingAtom).settlementDetails,
  (get, set, data: Partial<SettlementDetailsData>) => {
    const current = get(partnerBankOnboardingAtom);
    set(partnerBankOnboardingAtom, {
      ...current,
      settlementDetails: { ...current.settlementDetails, ...data },
    });
  }
);

export const configurationAtom = atom(
  (get) => get(partnerBankOnboardingAtom).configuration,
  (get, set, data: Partial<ConfigurationData>) => {
    const current = get(partnerBankOnboardingAtom);
    set(partnerBankOnboardingAtom, {
      ...current,
      configuration: { ...current.configuration, ...data },
    });
  }
);

// Helper atom to mark a step as completed
export const markStepCompletedAtom = atom(
  null,
  (get, set, step: number) => {
    const current = get(partnerBankOnboardingAtom);
    const completedSteps = [...current.completedSteps];
    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
      set(partnerBankOnboardingAtom, { ...current, completedSteps });
    }
  }
);

// Helper atom to check if we can navigate to a step
export const canNavigateToStepAtom = atom((get) => (targetStep: number) => {
  const { completedSteps, currentStep } = get(partnerBankOnboardingAtom);
  
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
    set(partnerBankOnboardingAtom, initialState);
  }
);