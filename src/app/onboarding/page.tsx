'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle } from 'lucide-react'
import { INDUSTRIES } from '@/lib/constants'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    teamEmails: ['', '', ''],
    teamRoles: ['ADMIN', 'PROCUREMENT', 'FINANCE'],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTeamEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.teamEmails]
    newEmails[index] = value
    setFormData((prev) => ({ ...prev, teamEmails: newEmails }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Submit onboarding data to API
    console.log('Submitting onboarding:', formData)
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <>
      <Header title="Welcome to SmartVendor" notificationCount={0} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-medium ${
                    step >= num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`h-1 w-12 ${
                      step > num ? 'bg-indigo-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step Titles */}
          <div className="mb-8 text-center">
            {step === 1 && (
              <>
                <h1 className="text-3xl font-bold text-slate-900">
                  Workspace Setup
                </h1>
                <p className="mt-2 text-slate-600">
                  Tell us about your company
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-3xl font-bold text-slate-900">
                  Invite Your Team
                </h1>
                <p className="mt-2 text-slate-600">
                  Add up to 3 team members
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-3xl font-bold text-slate-900">
                  Import Vendors
                </h1>
                <p className="mt-2 text-slate-600">
                  Add your existing vendors
                </p>
              </>
            )}
          </div>

          {/* Form Content */}
          <Card className="mb-8">
            <CardBody className="space-y-6">
              {/* Step 1: Workspace Setup */}
              {step === 1 && (
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    placeholder="e.g., Acme Manufacturing"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange('companyName', e.target.value)
                    }
                  />
                  <Select
                    label="Industry"
                    options={INDUSTRIES.map((ind) => ({
                      value: ind,
                      label: ind,
                    }))}
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange('industry', e.target.value)
                    }
                  />
                  <Select
                    label="Company Size"
                    options={[
                      { value: '1-10', label: '1-10 employees' },
                      { value: '11-50', label: '11-50 employees' },
                      { value: '51-200', label: '51-200 employees' },
                      { value: '200+', label: '200+ employees' },
                    ]}
                    value={formData.companySize}
                    onChange={(e) =>
                      handleInputChange('companySize', e.target.value)
                    }
                  />
                </div>
              )}

              {/* Step 2: Team Invitation */}
              {step === 2 && (
                <div className="space-y-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Team Member {index + 1}
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="email@company.com"
                          value={formData.teamEmails[index]}
                          onChange={(e) =>
                            handleTeamEmailChange(index, e.target.value)
                          }
                        />
                        <Select
                          options={[
                            { value: 'ADMIN', label: 'Admin' },
                            {
                              value: 'PROCUREMENT',
                              label: 'Procurement',
                            },
                            { value: 'FINANCE', label: 'Finance' },
                          ]}
                          value={formData.teamRoles[index]}
                          onChange={(e) => {
                            const newRoles = [...formData.teamRoles]
                            newRoles[index] = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              teamRoles: newRoles,
                            }))
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-slate-500">
                    You can skip this and add team members later from Settings.
                  </p>
                </div>
              )}

              {/* Step 3: Import Vendors */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-8 text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <h3 className="font-medium text-slate-900">
                      Upload CSV File
                    </h3>
                    <p className="text-sm text-slate-600">
                      Import your existing vendors from a CSV file
                    </p>
                    <Button variant="secondary" className="mt-4">
                      Choose File
                    </Button>
                    <p className="mt-2 text-xs text-slate-500">
                      Expected columns: name, email, phone, category
                    </p>
                  </div>
                  <div className="relative flex items-center gap-4">
                    <div className="flex-1 border-t border-slate-200" />
                    <span className="text-sm text-slate-500">or</span>
                    <div className="flex-1 border-t border-slate-200" />
                  </div>
                  <Button variant="secondary" className="w-full">
                    Add Vendors Manually Later
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between gap-4">
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>

            {step === 3 ? (
              <Button onClick={handleSubmit} className="min-w-[120px]">
                Complete Setup
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setStep(3)}>
                  Skip to Finish
                </Button>
                <Button onClick={handleNext} className="min-w-[120px]">
                  Next Step
                </Button>
              </>
            )}
          </div>

          {/* Checklist */}
          <div className="mt-8 space-y-2 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Getting Started Checklist
            </p>
            <div className="space-y-2">
              {[
                { done: step >= 1, label: 'Set up workspace' },
                { done: step >= 2, label: 'Invite team members' },
                { done: step >= 3, label: 'Import vendors' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400" />
                  )}
                  <span className={item.done ? 'text-slate-900' : 'text-slate-600'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
