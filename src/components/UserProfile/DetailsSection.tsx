import type { UserProfile } from "@/types/profile/profileTypes";
import { Edit3, Save, Smile, X } from "lucide-react";
import type React from "react";

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
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-sm hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Smile className="w-18 h-18 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {profile.name}
            </h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-sm text-gray-900">
              {profile.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={editedProfile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-sm text-gray-900">
              {profile.email}
            </p>
          )}
        </div>

        {/* bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={editedProfile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="px-4 py-3 bg-gray-50 rounded-sm text-gray-900">
              {profile.bio}
            </p>
          )}
        </div>
        {/*  Languages*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language (s)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.languages : profile.languages).map(
              (language: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-sm text-sm"
                >
                  {language}
                  {isEditing && (
                    <button
                      onClick={() => removeLanguage(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
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
              placeholder="Add new interest (press Enter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.interests : profile.interests).map(
              (interest: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-sm text-sm"
                >
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
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
              placeholder="Add new interest (press Enter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(isEditing ? editedProfile.subjects : profile.subjects).map(
              (subject: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-sm text-sm"
                >
                  {subject}
                  {isEditing && (
                    <button
                      onClick={() => removeSubject(index)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
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
              placeholder="Add new subject (press Enter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
