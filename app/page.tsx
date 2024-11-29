import SocialMediator from '../components/social-mediator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">VoiceConnect</h1>
      <SocialMediator />
    </main>
  )
}

