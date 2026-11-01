'use client'

import { Progress as ProgressPrimitive } from '@base-ui/react/progress'
import { cn } from 'cn'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { Paw } from '@/assets/icons/paw'
import { Button } from '@/components/ui/button'

export type GoalProgressCardProps = {
  collectedKilograms: number
  goalKilograms?: number
  goalProgress: number
  showGoal: boolean
  isEnglish: boolean
  className?: string
}

export function GoalProgressCard({
  collectedKilograms,
  goalKilograms = 1000,
  goalProgress,
  showGoal,
  isEnglish,
  className
}: GoalProgressCardProps) {
  return (
    <div
      data-slot="goal-progress-card"
      className={cn(
        "relative rotate-1 rounded-card-lg border-4 border-stroke bg-card px-10 pt-9.5 pb-8 text-ink shadow-panel before:absolute before:-top-3.25 before:left-1/2 before:h-6.25 before:w-18.5 before:-translate-x-1/2 before:-rotate-2 before:bg-[rgba(255,235,168,0.9)] before:content-[''] phone:px-5 phone:pt-8 phone:pb-6.75",
        className
      )}
    >
      <div className="absolute -top-8.75 right-6 flex rotate-8 gap-1.75" aria-hidden="true">
        <span className="h-4.25 w-6 rounded-circle border-4 border-ink bg-kibble-dark" />
        <span className="size-4.5 -translate-y-2.25 rounded-circle border-4 border-ink bg-kibble-light" />
        <span className="h-4.25 w-6 rounded-circle border-4 border-ink bg-kibble-dark" />
      </div>
      <div className="mb-6.75 flex items-end justify-between">
        <div className="grid">
          <strong className="font-heading text-[48px] leading-display phone:text-[40px]">
            {collectedKilograms} kg
          </strong>
          <span className="mt-1.75 text-caption font-black tracking-label-wide uppercase">
            {isEnglish ? 'collected' : 'reunidos'}
          </span>
        </div>
        <div className="grid text-right">
          <strong className="font-heading text-[48px] leading-display phone:text-[40px]">
            1,000 kg
          </strong>
          <span className="mt-1.75 text-caption font-black tracking-label-wide uppercase">
            {isEnglish ? 'the goal' : 'la meta'}
          </span>
        </div>
      </div>
      <ProgressPrimitive.Root
        value={collectedKilograms}
        min={0}
        max={goalKilograms}
        className="relative h-5 rounded-pill border-4 border-ink bg-[#e7dcbf]"
        style={{ '--goal-progress': `${goalProgress}%` } as CSSProperties}
        aria-label={
          isEnglish
            ? `${collectedKilograms} of 1,000 kilograms collected`
            : `${collectedKilograms} de 1,000 kilogramos reunidos`
        }
      >
        <span
          className={cn(
            'absolute inset-y-0 left-0 w-0 rounded-pill bg-accent motion-reduce:w-(--goal-progress,64%)!',
            showGoal && 'animate-[team-goal-fill_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]'
          )}
        />
        <span
          className={cn(
            'absolute top-1/2 left-0 z-2 grid size-13.5 transform-[translate(-50%,-50%)_rotate(-18deg)] place-items-center rounded-circle border-4 border-ink bg-brand text-ink opacity-0 phone:size-12 [&_svg]:size-8',
            'motion-reduce:left-(--goal-progress,64%)! motion-reduce:transform-[translate(-50%,-50%)]! motion-reduce:animate-none! motion-reduce:opacity-100!',
            showGoal && 'animate-[team-goal-paw_1.8s_cubic-bezier(0.2,0.8,0.2,1)_forwards]'
          )}
        >
          <Paw />
        </span>
      </ProgressPrimitive.Root>
      <div className="mt-3.75 flex justify-between text-caption font-black tracking-label uppercase phone:text-micro">
        <span>{isEnglish ? 'First kibble' : 'Primera croqueta'}</span>
        <span>{isEnglish ? 'Bowls full' : 'Platos llenos'}</span>
      </div>
      <p className="mt-7 border-t-2 border-dashed border-divider pt-5 text-center font-heading text-body font-extrabold">
        {isEnglish
          ? "No donation is too small. Except an imaginary kibble. Those don't count."
          : 'Ninguna donaci\xF3n es peque\xF1a. Excepto una croqueta imaginaria. Esas no cuentan.'}
      </p>
      <Button className="mx-auto mt-6.75 w-max" render={<Link href="/como-donar" />}>
        {isEnglish ? 'Help the goal' : 'Ayudar a la meta'}
      </Button>
    </div>
  )
}
