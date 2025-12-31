import type { UserProfile } from "@/types/profile/profileTypes";
import { Edit3, Save, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PROFILE_LOGOS = Array.from(
  { length: 12 },
  (_, i) => `/assets/lg_${i + 1}.png`
);

function DetailsSection({
  isEditing,
  handleEdit,
  handleSave,
  handleCancel,
  profile,
  handleInputChange,
  editedProfile,
  addLanguage,
  removeLanguage,
  addSubject,
  removeSubject,
  addInterest,
  removeInterest,
}: {
  isEditing: boolean;
  handleEdit: () => void;
  handleSave: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
  profile: any;
  handleInputChange: (field: keyof UserProfile, value: any) => void;
  editedProfile: any;
  addLanguage: (language: string) => void;
  removeLanguage: (index: number) => void;
  addSubject: (subject: string) => void;
  removeSubject: (index: number) => void;
  addInterest: (interest: string) => void;
  removeInterest: (index: number) => void;
}) {
  const [showLogoSelector, setShowLogoSelector] = useState(false);

  return (
    <div className="bg-card rounded-2xl shadow-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Profile Details</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-md"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4 pb-6 border-b border-border">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-primary/20 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              {(isEditing ? editedProfile.profilePic : profile.profilePic) ? (
                <img
                  src={
                    isEditing ? editedProfile.profilePic : profile.profilePic
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-primary">
                  {profile.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isEditing && (
              <button
                onClick={() => setShowLogoSelector(!showLogoSelector)}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
                title="Change profile picture"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground">
              {profile.name}
            </h3>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>

          {/* Logo Selector */}
          {isEditing && showLogoSelector && (
            <div className="w-full p-4 bg-muted rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-3">
                Select a profile picture:
              </p>
              <div className="grid grid-cols-6 gap-3">
                {PROFILE_LOGOS.map((logo) => (
                  <button
                    key={logo}
                    onClick={() => {
                      handleInputChange("profilePic", logo);
                      setShowLogoSelector(false);
                    }}
                    className={cn(
                      "relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                      editedProfile.profilePic === logo
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={logo}
                      alt="Profile option"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
            />
          ) : (
            <p className="px-4 py-3 bg-muted rounded-lg text-foreground">
              {profile.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editedProfile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
            />
          ) : (
            <p className="px-4 py-3 bg-muted rounded-lg text-foreground">
              {profile.email}
            </p>
          )}
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editedProfile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background resize-none"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="px-4 py-3 bg-muted rounded-lg text-foreground min-h-[100px]">
              {profile.bio || "No bio added yet."}
            </p>
          )}
        </div>

        {/*  Languages*/}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Language (s)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.languages : profile.languages).map(
              (language: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  {language}
                  {isEditing && (
                    <button
                      onClick={() => removeLanguage(index)}
                      className="ml-2 text-primary hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="Add a language and press Enter"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addLanguage(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.interests : profile.interests).map(
              (interest: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-accent/50 text-accent-foreground rounded-full text-sm font-medium border border-accent"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(index)}
                      className="ml-2 hover:text-accent-foreground/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="Add an interest and press Enter"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addInterest(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          )}
        </div>

        {/* Subjects */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Subjects
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.subjects : profile.subjects).map(
              (subject: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium border border-secondary"
                >
                  {subject}
                  {isEditing && (
                    <button
                      onClick={() => removeSubject(index)}
                      className="ml-2 hover:opacity-80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              )
            )}
          </div>
          {isEditing && (
            <input
              type="text"
              placeholder="Add a subject and press Enter"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addSubject(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailsSection;
