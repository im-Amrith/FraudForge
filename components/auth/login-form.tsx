"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
})

export function LoginForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" }
  })

  const handleCredentialsLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password
      })

      if (result?.error) {
        toast({ title: "Authentication failed", description: result.error, variant: "destructive" })
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" })
    }
  }

  return (
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCredentialsLogin)} className="space-y-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="name@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" placeholder="••••••••" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </Form>
      </div>
  )
}
