import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommunityType } from "@/types/community/communityTypes";
import { GRADIENT_COVERS, CATEGORIES } from "@/static/constants";

const PROFILE_LOGOS = Array.from(
  { length: 12 },
  (_, i) => `/assets/lg_${i + 1}.png`
);

interface CommunitySettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  community: CommunityType;
  onSave: (formData: FormData) => void;
}

export default function CommunitySettings({
  open,
  onOpenChange,
  community,
  onSave,
}: CommunitySettingsProps) {
  const [description, setDescription] = useState(community.description);
  const [category, setCategory] = useState(community.category);
  const [isNsfw, setIsNsfw] = useState(community.isNsfw || false);
  const [selectedIcon, setSelectedIcon] = useState(community.communityIcon);
  const [selectedCover, setSelectedCover] = useState(
    community.communityCoverImage || "sunset"
  );
  const [rules, setRules] = useState<Pick<CommunityType, "rules">["rules"]>(
    community.rules || []
  );
  const [currentRule, setCurrentRule] = useState("");
  const [tags, setTags] = useState<string[]>(community.tags || []);
  const [currentTag, setCurrentTag] = useState("");
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showCoverSelector, setShowCoverSelector] = useState(false);

  useEffect(() => {
    if (open) {
      setDescription(community.description);
      setCategory(community.category);
      setIsNsfw(community.isNsfw || false);
      setSelectedIcon(community.communityIcon);
      setSelectedCover(community.communityCoverImage || "sunset");
      setRules(community.rules || []);
      setTags(community.tags || []);
    }
  }, [open, community]);

  const handleAddRule = () => {
    if (currentRule.trim() && rules.length < 15) {
      setRules([...rules, { title: currentRule.trim(), body: "" }]);
      setCurrentRule("");
    }
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    // Create FormData for backend
    const formData = new FormData();

    formData.append("description", description);
    formData.append("category", category);
    formData.append("isNsfw", String(isNsfw));
    formData.append("communityIcon", selectedIcon);
    formData.append("communityCoverImage", selectedCover);
    formData.append("rules", JSON.stringify(rules));
    formData.append("tags", JSON.stringify(tags));

    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Community Settings
          </DialogTitle>
          <DialogDescription>
            Update your community details and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Community Name (Read-only) */}
          <div className="space-y-2">
            <Label>Community Name</Label>
            <Input
              value={community.communityName}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Community name cannot be changed
            </p>
          </div>

          {/* Community Icon Selector */}
          <div className="space-y-2">
            <Label>Community Icon</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-border overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <img
                  src={selectedIcon}
                  alt="Community icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowIconSelector(!showIconSelector)}
              >
                Change Icon
              </Button>
            </div>

            {showIconSelector && (
              <div className="p-4 bg-muted rounded-lg border border-border mt-3">
                <p className="text-sm font-medium mb-3">Select an icon:</p>
                <div className="grid grid-cols-6 gap-3">
                  {PROFILE_LOGOS.map((logo) => (
                    <button
                      key={logo}
                      type="button"
                      onClick={() => {
                        setSelectedIcon(logo);
                        setShowIconSelector(false);
                      }}
                      className={cn(
                        "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                        selectedIcon === logo
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img
                        src={logo}
                        alt="Icon option"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cover Gradient Selector */}
          <div className="space-y-2">
            <Label>Cover Gradient</Label>
            <div className="flex items-center gap-4">
              <div
                className="w-full h-24 rounded-lg border-2 border-border"
                style={{
                  background:
                    GRADIENT_COVERS.find((g) => g.id === selectedCover)
                      ?.gradient || GRADIENT_COVERS[0].gradient,
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCoverSelector(!showCoverSelector)}
              >
                Change Cover
              </Button>
            </div>

            {showCoverSelector && (
              <div className="p-4 bg-muted rounded-lg border border-border mt-3">
                <p className="text-sm font-medium mb-3">Select a gradient:</p>
                <div className="grid grid-cols-4 gap-3">
                  {GRADIENT_COVERS.map((cover) => (
                    <button
                      key={cover.id}
                      type="button"
                      onClick={() => {
                        setSelectedCover(cover.id);
                        setShowCoverSelector(false);
                      }}
                      className={cn(
                        "relative w-full h-20 rounded-lg border-2 transition-all hover:scale-105",
                        selectedCover === cover.id
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ background: cover.gradient }}
                    >
                      {selectedCover === cover.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span className="text-xs font-medium text-white drop-shadow-lg">
                          {cover.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={500}
              className="resize-none"
              placeholder="Describe your community..."
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* NSFW Toggle */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="nsfw">NSFW Content</Label>
              <p className="text-sm text-muted-foreground">
                Mark if community contains adult content
              </p>
            </div>
            <Switch id="nsfw" checked={isNsfw} onCheckedChange={setIsNsfw} />
          </div>

          {/* Rules */}
          <div className="space-y-2">
            <Label>Community Rules</Label>
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                >
                  <span className="flex-1 text-sm">{rule.title}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRule(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={currentRule}
                onChange={(e) => setCurrentRule(e.target.value)}
                placeholder="Add a rule..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddRule();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddRule}
                disabled={!currentRule.trim() || rules.length >= 15}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {rules.length}/15 rules
            </p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={!currentTag.trim() || tags.length >= 10}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {tags.length}/10 tags
            </p>
          </div>

          {/* Stats (Read-only) */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Members</p>
              <p className="text-2xl font-bold">{community.membersCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-lg font-semibold">
                {new Date(community.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
