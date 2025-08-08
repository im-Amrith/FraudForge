import type { Metadata } from "next"
import { OrganizationForm } from "@/components/auth/organization-form"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Organization Details - FraudForge AI",
  description: "Complete your organization setup",
}

export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">FraudForge AI</h1>
          <p className="text-muted-foreground">Complete your organization setup</p>
        </div>
        <OrganizationForm />
      </div>
    </div>
  )
}

