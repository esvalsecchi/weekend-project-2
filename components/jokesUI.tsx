/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/ks7BJ9zhdo1
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Gabarito } from 'next/font/google'
import { Libre_Franklin } from 'next/font/google'

gabarito({
  subsets: ['latin'],
  display: 'swap',
})

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { LaughIcon, ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react'

interface Evaluation {
  funny: number;
  appropriate: number;
  offensive: number;
}

export default function JokesUI() {
  const [joke, setJoke] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const data = {
      topic: formData.get('topic'),
      tone: formData.get('tone'),
      type: formData.get('type'),
      temperature: formData.get('temperature'),

    }

    try {
      const response = await fetch('/api/jokes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jokeText = await response.text(); // Changed from response.json()
    setJoke(jokeText);
    } catch (error) {
      console.error('Error fetching joke:', error)
      setJoke('Failed to generate joke. Please try again.')
    } finally {
      setIsLoading(false)
      setEvaluation(null)
    }
  }
  const handleEvaluate = async () => {
    if (!joke) return;
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joke }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Evaluation result:', result);
      setEvaluation(result);
    } catch (error) {
      console.error('Error during evaluation:', error);
      setEvaluation({ funny: 0, appropriate: 0, offensive: 0 });
    } finally {
      setIsEvaluating(false);
    }
  };

  const PercentageBar = ({ label, value, icon: Icon, isNegative = false }: { label: string; value: number; icon: React.ElementType; isNegative?: boolean }) => (
    <div className="flex items-center gap-4 mb-2">
      <Icon className={`w-6 h-6 ${isNegative ? 'text-red-500' : 'text-green-500'}`} />
      <span className="w-24 text-sm font-medium">{label}</span>
      <div className="flex-grow bg-gray-200 rounded-full h-3.5 overflow-hidden border-2 border-gray-300" style={{ border: 'solid 1px grey', borderRadius: '5px' }}>
        <div 
          className={`h-full ${isNegative ? 'bg-red-500' : 'bg-green-500'}`} 
          style={{ width: `${value}%`, background: 'Green' }}
        ></div>
      </div>
      <span className="text-sm font-medium w-12 text-right">{value.toFixed(1)}%</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Customizable AI Jokes</h1>
          <p className="text-muted-foreground">Generate unique and personalized jokes with our AI-powered tool.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Configure Your Joke</CardTitle>
            <CardDescription>Adjust the settings to generate the perfect joke for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Select name="topic" defaultValue="comedy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="puns">Puns</SelectItem>
                      <SelectItem value="dad-jokes">Dad Jokes</SelectItem>
                      <SelectItem value="dark-humor">Dark Humor</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select name="tone" defaultValue="funny">
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funny">Funny</SelectItem>
                      <SelectItem value="witty">Witty</SelectItem>
                      <SelectItem value="sarcastic">Sarcastic</SelectItem>
                      <SelectItem value="wholesome">Offensive</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="one-liner">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-liner">One-liner</SelectItem>
                      <SelectItem value="short-story">Short Story</SelectItem>
                      <SelectItem value="knock-knock">Knock-Knock</SelectItem>
                      <SelectItem value="pun">Pun</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Slider name="temperature" min={0} max={1} step={0.1} defaultValue={[0.5]} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Joke'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Joke</h2>
            <Button onClick={handleEvaluate} disabled={!joke || isEvaluating}>
            {isEvaluating ? 'Evaluating...' : 'Evaluate Joke'} 
           </Button>
            
          </div>
          <div className="bg-muted p-6 rounded-md shadow-sm">
            <p className="text-xl font-medium">{joke || "Why can't a bicycle stand up by itself? It's two-tired!"}</p>
          </div>

          {evaluation && (
              <div className="mt-4 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Evaluation Results:</h3>
                <PercentageBar label="Funny" value={evaluation.funny} icon={LaughIcon} />
                <PercentageBar label="Appropriate" value={evaluation.appropriate} icon={ThumbsUpIcon} />
                <PercentageBar label="Offensive" value={evaluation.offensive} icon={ThumbsDownIcon} isNegative={true} />
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

// ... (rest of the code remains unchanged)
