'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Mic, MicOff, Globe, Lock, LogOut, Heart, MessageCircle, Share2 } from 'lucide-react'

type Dialogue = {
  id: string;
  content: string;
  isPublic: boolean;
  likes: number;
  comments: number;
  audioUrl?: string;
}

export default function SocialMediator() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [dialogues, setDialogues] = useState<Dialogue[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
    }
  }, [])

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: BlobPart[] = []

        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data)
        })

        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks)
          const audioUrl = URL.createObjectURL(audioBlob)
          if (audioRef.current) {
            audioRef.current.src = audioUrl
          }
          const newDialogue: Dialogue = {
            id: Date.now().toString(),
            content: `Voice message ${dialogues.length + 1}`,
            isPublic,
            likes: 0,
            comments: 0,
            audioUrl
          }
          setDialogues(prev => [newDialogue, ...prev])
        })

        mediaRecorder.start()
        setIsRecording(true)

        setTimeout(() => {
          mediaRecorder.stop()
          setIsRecording(false)
        }, 5000) // Record for 5 seconds
      } catch (err) {
        console.error('Error accessing microphone:', err)
      }
    } else {
      setIsRecording(false)
    }
  }

  const togglePublic = () => {
    setIsPublic(!isPublic)
  }

  const leaveDialogue = (id: string) => {
    setDialogues(prev => prev.filter(dialogue => dialogue.id !== id))
  }

  const likeDialogue = (id: string) => {
    setDialogues(prev => prev.map(dialogue => 
      dialogue.id === id ? { ...dialogue, likes: dialogue.likes + 1 } : dialogue
    ))
  }

  return (
    <div className="w-full max-w-md">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={toggleRecording} className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} w-full mr-2`}>
              {isRecording ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
              {isRecording ? 'Stop' : 'Record'}
            </Button>
            <div className="flex items-center">
              <Switch
                checked={isPublic}
                onCheckedChange={togglePublic}
                aria-label="Toggle public/private"
              />
              <span className="ml-2">{isPublic ? <Globe className="text-green-500" /> : <Lock className="text-red-500" />}</span>
            </div>
          </div>
          {audioRef.current && audioRef.current.src && (
            <audio controls className="w-full mb-2">
              <source src={audioRef.current.src} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
        </CardContent>
      </Card>
      <div className="space-y-4">
        {dialogues.map((dialogue) => (
          <Card key={dialogue.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">User</p>
                  <p className="text-sm text-gray-500">{dialogue.isPublic ? 'Public' : 'Private'}</p>
                </div>
              </div>
              <p className="mb-2">{dialogue.content}</p>
              {dialogue.audioUrl && (
                <audio controls className="w-full mb-2">
                  <source src={dialogue.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              <div className="flex justify-between items-center mt-2">
                <div className="flex space-x-4">
                  <Button variant="ghost" size="sm" onClick={() => likeDialogue(dialogue.id)}>
                    <Heart className="h-4 w-4 mr-1" />
                    {dialogue.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {dialogue.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={() => leaveDialogue(dialogue.id)}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

