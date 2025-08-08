import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "FraudForge AI has transformed our fraud detection capabilities. We've seen a 78% reduction in false positives while catching more actual fraud attempts.",
      author: "Sarah Johnson",
      role: "CTO",
      company: "Global Finance",
    },
    {
      quote:
        "The real-time monitoring and AI-powered insights have given us unprecedented visibility into our transaction patterns.",
      author: "Michael Chen",
      role: "Head of Security",
      company: "TechCorp",
    },
    {
      quote:
        "Implementing FraudForge AI was seamless and the results were immediate. Our fraud losses dropped by 65% in the first quarter.",
      author: "Emily Rodriguez",
      role: "VP of Operations",
      company: "Digital Payments Inc",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Industry Leaders</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See what our customers are saying about how FraudForge AI has transformed their fraud detection
              capabilities.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-muted bg-background">
              <CardHeader className="pb-2 flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={testimonial.author} />
                  <AvatarFallback>
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                  <CardDescription>{testimonial.role} at {testimonial.company}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

