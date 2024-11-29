'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, MessageSquare, Users } from 'lucide-react'

export default function ConflictMediator() {
  const [step, setStep] = useState(1)
  const [conflict, setConflict] = useState('')
  const [parties, setParties] = useState('')
  const [mediation, setMediation] = useState('')

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
    else {
      // Here you would typically send the data to a backend or AI service
      console.log('Submitting mediation request:', { conflict, parties, mediation })
      // Reset the form
      setStep(1)
      setConflict('')
      setParties('')
      setMediation('')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Conflict Resolution Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Describe the conflict situation:
            </label>
            <Textarea
              placeholder="E.g., There's a disagreement about project responsibilities..."
              value={conflict}
              onChange={(e) => setConflict(e.target.value)}
              rows={4}
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              List the parties involved:
            </label>
            <Textarea
              placeholder="E.g., Team lead, Developer A, Developer B..."
              value={parties}
              onChange={(e) => setParties(e.target.value)}
              rows={4}
            />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Suggest a mediation approach:
            </label>
            <Textarea
              placeholder="E.g., Schedule a meeting to clarify roles and responsibilities..."
              value={mediation}
              onChange={(e) => setMediation(e.target.value)}
              rows={4}
            />
          </div>
        )}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex space-x-2">
            <MessageSquare className={`w-6 h-6 ${step >= 1 ? 'text-blue-500' : 'text-gray-300'}`} />
            <ArrowRight className="w-6 h-6 text-gray-300" />
            <Users className={`w-6 h-6 ${step >= 2 ? 'text-blue-500' : 'text-gray-300'}`} />
            <ArrowRight className="w-6 h-6 text-gray-300" />
            <MessageSquare className={`w-6 h-6 ${step >= 3 ? 'text-blue-500' : 'text-gray-300'}`} />
          </div>
          <Button onClick={handleNextStep}>
            {step < 3 ? 'Next' : 'Submit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

