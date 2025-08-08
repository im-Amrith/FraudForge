import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AIChat } from "@/components/ai/ai-chat"

export default function AssistantPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Get instant answers about transactions, policies, and compliance with our AI assistant.
        </p>
      </div>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>FraudForge AI Assistant</CardTitle>
          <CardDescription>
            Get instant help and answers to your questions about fraud detection, compliance, and system usage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AIChat />
        </CardContent>
      </Card>
    </div>
  )
}





// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { AIChat } from "@/components/ai/ai-chat"

// export default function AssistantPage() {
//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex flex-col gap-2">
//         <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
//         <p className="text-muted-foreground">
//           Get instant answers about transactions, policies, and compliance with our AI assistant.
//         </p>
//       </div>
//       <Card className="flex-1">
//         <CardHeader>
//           <CardTitle>FraudForge AI Assistant</CardTitle>
//           <CardDescription>
//             Ask questions about transactions, policies, compliance, or get help with the platform.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <AIChat />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

