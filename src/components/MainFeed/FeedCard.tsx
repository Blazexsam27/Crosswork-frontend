import { ArrowBigUp, ArrowBigDown, MessageSquare, Share2, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Post {
  id: number
  community: string
  communityIcon: string
  author: string
  timeAgo: string
  title: string
  content: string
  upvotes: number
  comments: number
  tags: string[]
}

export function FeedCard({ post }: { post: Post }) {
  return (
    <article className="rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2 text-sm">
          <span className="text-lg">{post.communityIcon}</span>
          <span className="font-semibold text-foreground">{post.community}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">Posted by u/{post.author}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{post.timeAgo}</span>
        </div>

        {/* Content */}
        <h2 className="mb-2 text-lg font-semibold leading-snug text-foreground">{post.title}</h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{post.content}</p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-background">
            <Button variant="ghost" size="sm" className="gap-1 rounded-r-none border-r border-border">
              <ArrowBigUp className="h-4 w-4" />
              <span className="text-sm font-medium">{post.upvotes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="rounded-l-none">
              <ArrowBigDown className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{post.comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden text-sm sm:inline">Share</span>
          </Button>

          <Button variant="ghost" size="sm" className="ml-auto">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  )
}
