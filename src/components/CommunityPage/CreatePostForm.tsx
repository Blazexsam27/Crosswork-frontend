import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ImagePlus,
  Link2,
  FileText,
  X,
  Plus,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import communityService from "@/services/community.service";
import type { CommunityType } from "@/types/community/communityTypes";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import postsService from "@/services/posts.service";
import { useToast } from "@/hooks/use-toast";

interface CreatePostFormProps {
  communityName?: string;
  communityId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated?: () => void;
}

export default function CreatePostForm({
  communityName,
  communityId,
  open,
  onOpenChange,
  onPostCreated,
}: CreatePostFormProps) {
  const [postType, setPostType] = useState<"text" | "image" | "link">("text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isNSFW, setIsNSFW] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState(
    communityName || ""
  );
  const [openCommunitySelector, setOpenCommunitySelector] = useState(false);
  const [communities, setCommunities] = useState<CommunityType[]>([]);
  const currentUser = getFromLocalStorage("user");
  const { toast } = useToast();

  const handleAddTag = () => {
    if (
      currentTag.trim() &&
      tags.length < 5 &&
      !tags.includes(currentTag.trim())
    ) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setLinkUrl("");
    setTags([]);
    setImagePreview(null);
    setIsNSFW(false);
    setIsSpoiler(false);
    if (!communityName) setSelectedCommunity("");
    setPostType("text");
    setCurrentTag("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData = {
        author: currentUser._id,
        postType,
        title,
        body,
        linkUrl,
        tags,
        isNSFW,
        isSpoiler,
        community: communityId,
        image: imagePreview,
      };
      const response = await postsService.createPost(postData);
      console.log("Post created successfully", response);

      toast({
        title: "Success",
        description: "Your post has been created successfully",
      });

      resetForm();
      onOpenChange(false);

      // Call the callback to refresh posts
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error("Error while creating post", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAllCommunities = async () => {
    try {
      const communities = await communityService.getAllCommunities();
      setCommunities(communities);
    } catch (error) {
      console.error("Error while getting communities", error);
    }
  };

  useEffect(() => {
    getAllCommunities();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl min-w-[50%]  max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a Post
          </DialogTitle>
          <DialogDescription>
            {communityName
              ? `Share your thoughts in ${communityName}`
              : "Share your thoughts with the community"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!communityName && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Select Community <span className="text-destructive">*</span>
              </Label>
              <Popover
                open={openCommunitySelector}
                onOpenChange={setOpenCommunitySelector}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCommunitySelector}
                    className="w-full justify-between bg-background border-border hover:bg-accent/50"
                  >
                    {selectedCommunity
                      ? `c/${
                          communities.find(
                            (c) => c.communityName === selectedCommunity
                          )?.communityName
                        }`
                      : "Choose a community..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search communities..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No community found.</CommandEmpty>
                      <CommandGroup>
                        {communities.map((community) => (
                          <CommandItem
                            key={community.communityName}
                            value={community.communityName}
                            onSelect={(currentValue) => {
                              setSelectedCommunity(
                                currentValue === selectedCommunity
                                  ? ""
                                  : currentValue
                              );
                              setOpenCommunitySelector(false);
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold">
                                  {community.communityName.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    c/{community.communityName}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {community.membersCount} members
                                  </span>
                                </div>
                              </div>
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  selectedCommunity === community.communityName
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCommunity && (
                <p className="text-xs text-muted-foreground">
                  Posting to c/{selectedCommunity}
                </p>
              )}
            </div>
          )}

          <Tabs
            value={postType}
            onValueChange={(value) =>
              setPostType(value as "text" | "image" | "link")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                <span className="hidden sm:inline">Image</span>
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                <span className="hidden sm:inline">Link</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-2 mt-6">
              <Label htmlFor="title" className="text-sm font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="An interesting title for your post..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={300}
                className="bg-background border-border focus-visible:ring-ring"
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/300 characters
              </p>
            </div>

            <TabsContent value="text" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind? (Optional)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={6}
                  className="bg-background border-border focus-visible:ring-ring resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="image-upload" className="text-sm font-semibold">
                  Upload Image <span className="text-destructive">*</span>
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setImagePreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="image-content"
                  className="text-sm font-semibold"
                >
                  Description (Optional)
                </Label>
                <Textarea
                  id="image-content"
                  placeholder="Add a description to your image..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  className="bg-background border-border focus-visible:ring-ring resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="link-url" className="text-sm font-semibold">
                  URL <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="bg-background border-border focus-visible:ring-ring"
                  required={postType === "link"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-content" className="text-sm font-semibold">
                  Description (Optional)
                </Label>
                <Textarea
                  id="link-content"
                  placeholder="Tell us more about this link..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  className="bg-background border-border focus-visible:ring-ring resize-none"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <Label htmlFor="tags" className="text-sm font-semibold">
              Tags (Optional)
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="bg-background border-border focus-visible:ring-ring"
                disabled={tags.length >= 5}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={!currentTag.trim() || tags.length >= 5}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 flex items-center gap-1 bg-accent/50 hover:bg-accent"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {tags.length}/5 tags used
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold">Post Options</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="nsfw" className="text-sm font-medium">
                  NSFW
                </Label>
                <p className="text-xs text-muted-foreground">
                  Not safe for work content
                </p>
              </div>
              <Switch id="nsfw" checked={isNSFW} onCheckedChange={setIsNSFW} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="spoiler" className="text-sm font-medium">
                  Spoiler
                </Label>
                <p className="text-xs text-muted-foreground">
                  Hide content behind a spoiler warning
                </p>
              </div>
              <Switch
                id="spoiler"
                checked={isSpoiler}
                onCheckedChange={setIsSpoiler}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={resetForm}
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-primary hover:bg-primary/90 shadow-md"
              disabled={
                !title.trim() ||
                (postType === "link" && !linkUrl.trim()) ||
                (!communityName && !selectedCommunity)
              }
            >
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
