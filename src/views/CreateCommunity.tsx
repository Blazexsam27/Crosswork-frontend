import { useState, useRef } from "react";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  ImageIcon,
  Info,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { getFromLocalStorage } from "@/utils/webstorage.utls";
import type { UserType } from "@/types/user/userTypes";
import communityService from "@/services/community.service";

export default function CreateCommunityPage() {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [privacyType, setPrivacyType] = useState("public");
  const [rules, setRules] = useState<{ title: string; description: string }[]>(
    []
  );
  const [currentRule, setCurrentRule] = useState({
    title: "",
    description: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isNSFW, setIsNSFW] = useState(false);
  const [communityIcon, setCommunityIcon] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const user: UserType = getFromLocalStorage("user");
  interface FormErrors {
    name?: string | null;
    description?: string | null;
    category?: string | null;
    icon?: string | null;
    cover?: string | null;
    rule?: string | null;
    tag?: string | null;
  }
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  interface SubmitStatus {
    type: "success" | "error";
    message: string;
  }
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Technology",
    "Science",
    "Education",
    "Business",
    "Arts & Design",
    "Health & Fitness",
    "Gaming",
    "Sports",
    "Entertainment",
    "Lifestyle",
    "Other",
  ];

  const MAX_DESCRIPTION_LENGTH = 500;
  const MAX_ICON_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_TAGS = 10;
  const MAX_RULES = 15;

  // Validation functions
  const validateCommunityName = (name: string) => {
    if (!name.trim()) return "Community name is required";
    if (name.length < 3) return "Community name must be at least 3 characters";
    if (name.length > 50)
      return "Community name must be less than 50 characters";
    if (/\s/.test(name)) return "Community name cannot contain spaces";
    if (!/^[a-zA-Z0-9_&-]+$/.test(name))
      return "Community name can only contain letters, numbers, _, & and -";
    return null;
  };

  const validateDescription = (desc: string) => {
    if (!desc.trim()) return "Description is required";
    if (desc.length < 20) return "Description must be at least 20 characters";
    if (desc.length > MAX_DESCRIPTION_LENGTH)
      return `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
    return null;
  };

  const validateCategory = (cat: string) => {
    if (!cat) return "Please select a category";
    return null;
  };

  const validateImage = (file: any, maxSize: any, type: any) => {
    if (!file) return null;

    if (!file.type.startsWith("image/")) {
      return `${type} must be an image file`;
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      return `${type} must be PNG or JPG format`;
    }

    if (file.size > maxSize) {
      return `${type} must be less than ${maxSize / (1024 * 1024)}MB`;
    }

    return null;
  };

  // Image handling
  const handleImageUpload = (e: any, type: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = type === "icon" ? MAX_ICON_SIZE : MAX_COVER_SIZE;
    const error = validateImage(
      file,
      maxSize,
      type === "icon" ? "Icon" : "Cover image"
    );

    if (error) {
      setErrors((prev) => ({ ...prev, [type]: error }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "icon") {
        setIconPreview(reader.result);
        setCommunityIcon(file);
        setErrors((prev) => ({ ...prev, icon: null }));
      } else {
        setCoverPreview(reader.result);
        setCoverImage(file);
        setErrors((prev) => ({ ...prev, cover: null }));
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: string) => {
    if (type === "icon") {
      setCommunityIcon(null);
      setIconPreview(null);
      if (iconInputRef.current) iconInputRef.current.value = "";
    } else {
      setCoverImage(null);
      setCoverPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  // Rule management
  const addRule = () => {
    if (!currentRule.title.trim() || !currentRule.description.trim()) {
      setErrors((prev) => ({
        ...prev,
        rule: "Both rule title and description are required",
      }));
      return;
    }

    if (rules.length >= MAX_RULES) {
      setErrors((prev) => ({
        ...prev,
        rule: `Maximum ${MAX_RULES} rules allowed`,
      }));
      return;
    }

    if (currentRule.title.length > 100) {
      setErrors((prev) => ({
        ...prev,
        rule: "Rule title must be less than 100 characters",
      }));
      return;
    }

    setRules([...rules, currentRule]);
    setCurrentRule({ title: "", description: "" });
    setErrors((prev) => ({ ...prev, rule: null }));
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  // Tag management
  const addTag = () => {
    const trimmedTag = currentTag.trim().toLowerCase();

    if (!trimmedTag) {
      setErrors((prev) => ({ ...prev, tag: "Tag cannot be empty" }));
      return;
    }

    if (tags.length >= MAX_TAGS) {
      setErrors((prev) => ({
        ...prev,
        tag: `Maximum ${MAX_TAGS} tags allowed`,
      }));
      return;
    }

    if (tags.includes(trimmedTag)) {
      setErrors((prev) => ({ ...prev, tag: "Tag already exists" }));
      return;
    }

    if (trimmedTag.length > 30) {
      setErrors((prev) => ({
        ...prev,
        tag: "Tag must be less than 30 characters",
      }));
      return;
    }

    if (!/^[a-zA-Z0-9-]+$/.test(trimmedTag)) {
      setErrors((prev) => ({
        ...prev,
        tag: "Tag can only contain letters, numbers, and hyphens",
      }));
      return;
    }

    setTags([...tags, trimmedTag]);
    setCurrentTag("");
    setErrors((prev) => ({ ...prev, tag: null }));
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  interface Error {
    [key: string]: string | null;
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Error = {};

    const nameError = validateCommunityName(communityName);
    if (nameError) newErrors.name = nameError;

    const descError = validateDescription(description);
    if (descError) newErrors.description = descError;

    const catError = validateCategory(category);
    if (catError) newErrors.category = catError;

    const iconError = validateImage(communityIcon, MAX_ICON_SIZE, "Icon");
    if (iconError) newErrors.icon = iconError;

    const coverError = validateImage(coverImage, MAX_COVER_SIZE, "Cover image");
    if (coverError) newErrors.cover = coverError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append("communityName", communityName);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("type", privacyType);
      formData.append("communityIcon", "Community Icon");
      formData.append("communityCoverImage", "communityCoverImage");
      formData.append("moderators", user._id);
      formData.append("createdBy", user._id);
      formData.append("isNsfw", String(isNSFW));
      formData.append("rules", JSON.stringify(rules));
      formData.append("tags", JSON.stringify(tags));

      if (communityIcon) {
        formData.append("icon", communityIcon);
      }

      if (coverImage) {
        formData.append("cover", coverImage);
      }

      // IMPLEMENT API ENDPOINT CALL:
      const resp = await communityService.createCommunity(formData);
      console.log("Respon", resp);
      setSubmitStatus({
        type: "success",
        message: "Community created successfully! Redirecting...",
      });

      // Reset form after successful submission
      setTimeout(() => {
        // In real app: navigate('/community/' + data.id)
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Error creating community:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to create community. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create a Community
          </h1>
          <p className="mt-2 text-gray-600">
            Build a space for students to connect, share knowledge, and grow
            together
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div
            className={`mb-6 rounded-lg p-4 flex items-center gap-3 ${
              submitStatus.type === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <p
              className={`text-sm font-medium ${
                submitStatus.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {submitStatus.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Community Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Community Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={communityName}
                  onChange={(e) => {
                    setCommunityName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({
                        ...prev,
                        name: validateCommunityName(e.target.value),
                      }));
                    }
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      name: validateCommunityName(communityName),
                    }))
                  }
                  placeholder="e.g., Computer Science Hub"
                  className={`w-full rounded-lg border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                )}
                {!errors.name && (
                  <p className="mt-1.5 text-xs text-gray-500">
                    Choose a unique name that represents your community (3-50
                    characters)
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                      setDescription(e.target.value);
                      if (errors.description) {
                        setErrors((prev) => ({
                          ...prev,
                          description: validateDescription(e.target.value),
                        }));
                      }
                    }
                  }}
                  onBlur={() =>
                    setErrors((prev) => ({
                      ...prev,
                      description: validateDescription(description),
                    }))
                  }
                  placeholder="Tell students what your community is about..."
                  rows={4}
                  className={`w-full rounded-lg border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                />
                <div className="mt-1.5 flex items-center justify-between">
                  {errors.description ? (
                    <p className="text-xs text-red-600">{errors.description}</p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Minimum 20 characters
                    </p>
                  )}
                  <p
                    className={`text-xs ${
                      description.length > MAX_DESCRIPTION_LENGTH * 0.9
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  >
                    {description.length}/{MAX_DESCRIPTION_LENGTH}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-900"
                >
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setErrors((prev) => ({ ...prev, category: null }));
                  }}
                  className={`w-full rounded-lg border ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  } bg-white px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Visual Identity */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Visual Identity
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Community Icon */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Community Icon
                </label>
                <input
                  ref={iconInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleImageUpload(e, "icon")}
                  className="hidden"
                />
                {iconPreview ? (
                  <div className="relative rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="mx-auto h-32 w-32 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("icon")}
                      className="absolute top-2 right-2 rounded-full bg-red-100 p-1.5 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => iconInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      Upload Icon
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG up to 2MB
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: 256x256px
                    </p>
                  </div>
                )}
                {errors.icon && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.icon}</p>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Cover Image
                </label>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => handleImageUpload(e, "cover")}
                  className="hidden"
                />
                {coverPreview ? (
                  <div className="relative rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="mx-auto h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("cover")}
                      className="absolute top-2 right-2 rounded-full bg-red-100 p-1.5 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Upload className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      Upload Cover
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG up to 5MB
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: 1920x384px
                    </p>
                  </div>
                )}
                {errors.cover && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.cover}</p>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Privacy & Access
            </h2>

            <div className="space-y-3">
              {/* Public */}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="privacy"
                  value="public"
                  checked={privacyType === "public"}
                  onChange={(e) => setPrivacyType(e.target.value)}
                  className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Public</div>
                  <div className="text-sm text-gray-600">
                    Anyone can view, post, and comment in this community
                  </div>
                </div>
              </label>

              {/* Restricted */}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="privacy"
                  value="restricted"
                  checked={privacyType === "restricted"}
                  onChange={(e) => setPrivacyType(e.target.value)}
                  className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Restricted</div>
                  <div className="text-sm text-gray-600">
                    Anyone can view, but only approved members can post
                  </div>
                </div>
              </label>

              {/* Private */}
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="privacy"
                  value="private"
                  checked={privacyType === "private"}
                  onChange={(e) => setPrivacyType(e.target.value)}
                  className="mt-1 h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Private</div>
                  <div className="text-sm text-gray-600">
                    Only approved members can view and contribute
                  </div>
                </div>
              </label>
            </div>

            {/* NSFW Toggle */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <input
                type="checkbox"
                id="nsfw"
                checked={isNSFW}
                onChange={(e) => setIsNSFW(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="nsfw" className="flex-1 cursor-pointer">
                <div className="font-medium text-gray-900">18+ Community</div>
                <div className="text-sm text-gray-600">
                  This community contains mature content
                </div>
              </label>
            </div>
          </div>

          {/* Community Rules */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Community Rules
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <span>Optional but recommended</span>
              </div>
            </div>

            {/* Existing Rules */}
            {rules.length > 0 && (
              <div className="mb-4 space-y-3">
                {rules.map((rule, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                            {index + 1}
                          </span>
                          <h3 className="font-medium text-gray-900">
                            {rule.title}
                          </h3>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {rule.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRule(index)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Rule */}
            <div className="space-y-3">
              <input
                type="text"
                value={currentRule.title}
                onChange={(e) =>
                  setCurrentRule({ ...currentRule, title: e.target.value })
                }
                placeholder="Rule title (e.g., Be respectful)"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={currentRule.description}
                onChange={(e) =>
                  setCurrentRule({
                    ...currentRule,
                    description: e.target.value,
                  })
                }
                placeholder="Rule description..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {errors.rule && (
                <p className="text-xs text-red-600">{errors.rule}</p>
              )}
              <button
                type="button"
                onClick={addRule}
                disabled={rules.length >= MAX_RULES}
                className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                Add Rule {rules.length > 0 && `(${rules.length}/${MAX_RULES})`}
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Tags</h2>
            <p className="mb-4 text-sm text-gray-600">
              Add tags to help students discover your community (max {MAX_TAGS})
            </p>

            {/* Existing Tags */}
            {tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-900"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Tag */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag (press Enter)"
                  disabled={tags.length >= MAX_TAGS}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={tags.length >= MAX_TAGS}
                  className="rounded-lg bg-gray-200 px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              {errors.tag && (
                <p className="text-xs text-red-600">{errors.tag}</p>
              )}
              {tags.length > 0 && (
                <p className="text-xs text-gray-500">
                  {tags.length}/{MAX_TAGS} tags used
                </p>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Community"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
