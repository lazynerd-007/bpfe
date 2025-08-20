'use client';

import { usePathname } from 'next/navigation';
import { useAtom } from 'jotai';
import { completedStepsAtom } from '@/features/partner-banks/onboarding/store';
import { IconBuilding, IconReceipt, IconCreditCard, IconSettings } from '@tabler/icons-react';
import { ROUTES } from '@/lib/constants';
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"

const steps = [
  {
    step: 1,
    title: "Basic Details",
    icon: IconBuilding,
    path: ROUTES.PARTNER_BANKS.ONBOARDING.BASIC_DETAILS,
  },
  {
    step: 2,
    title: "Commission Details",
    icon: IconReceipt,
    path: ROUTES.PARTNER_BANKS.ONBOARDING.COMMISSION_DETAILS,
  },
  {
    step: 3,
    title: "Settlement Details",
    icon: IconCreditCard,
    path: ROUTES.PARTNER_BANKS.ONBOARDING.SETTLEMENT_DETAILS,
  },
  {
    step: 4,
    title: "Configuration",
    icon: IconSettings,
    path: ROUTES.PARTNER_BANKS.ONBOARDING.CONFIGURATION,
  },
]

export function PartnerBankOnboardingStepper() {
  const pathname = usePathname();
  const [completedSteps] = useAtom(completedStepsAtom);
  
  // Determine current step based on URL path
  const currentStep = steps.find(step => step.path === pathname)?.step || 1;

  return (
    <div className="w-full">
      <Stepper value={currentStep} className="w-full">
        {steps.map(({ step, title, icon: Icon }) => {
          const isCompleted = completedSteps.includes(step);
          
          return (
            <StepperItem
              key={step}
              step={step}
              completed={isCompleted}
              className="flex-1 max-md:items-start"
            >
              <StepperTrigger className="rounded max-md:flex-col group w-full">
                <StepperIndicator asChild>
                  <div className="flex items-center justify-center">
                    {isCompleted ? (
                      <div className="text-xs font-medium">{step}</div>
                    ) : (
                      <Icon className="w-3 h-3" />
                    )}
                  </div>
                </StepperIndicator>
                <div className="text-center md:text-left ml-3 max-md:ml-0 max-md:mt-2">
                  <StepperTitle className="text-sm font-medium group-data-[state=active]:text-primary">
                    {title}
                  </StepperTitle>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
              )}
            </StepperItem>
          );
        })}
      </Stepper>
    </div>
  );
}