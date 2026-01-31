import { useState, useEffect } from "react";
import { FiBriefcase, FiCamera, FiEdit2 } from "react-icons/fi";
import { useGetMeQuery, useUpdateMeMutation } from "../../redux/api/userApi";
import toast from "react-hot-toast";

const Settings = () => {
  const { data: profileData } = useGetMeQuery();
  const profile = profileData?.data;
  //console.log("from setting", profile);

  const [updateUser, { isLoading: isUpdating }] = useUpdateMeMutation();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    avatar: null, // This will hold the File object
    avatarPreview: "", // This will hold a preview URL
    address: "",
  });

  // Populate formData when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.fullName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        role: profile.role || "",
        avatar: null,
        avatarPreview: profile.profileImage || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.fullName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        role: profile.role || "",
        avatar: null,
        avatarPreview: profile.profileImage || "",
        address: profile.address || "",
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const payload = new FormData();
      payload.append("fullName", formData.name);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("address", formData.address);
      if (formData.avatar) payload.append("profileImage", formData.avatar);

      await updateUser(payload).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm section-pad">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-1 text-xl sm:text-2xl font-semibold text-gray-900">
            Profile & Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3 group">
            <div className="w-24 h-24 overflow-hidden bg-gray-300 rounded-full">
              {formData.avatarPreview ? (
                <img
                  src={formData.avatarPreview}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-3xl font-semibold text-white bg-gradient-to-br from-blue-400 to-blue-600">
                  {formData.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 rounded-full opacity-0 cursor-pointer group-hover:opacity-100">
                <FiCamera className="w-6 h-6 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}

            <div className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 bg-white border-2 border-gray-200 rounded-full">
              <FiBriefcase className="w-3 h-3 text-gray-600" />
            </div>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-0.5">
            {formData.name}
          </h2>
          <p className="mb-3 text-sm sm:text-base text-gray-500">
            {formData.role}
          </p>

          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 text-sm sm:text-base font-medium text-gray-700 transition-colors border border-gray-300 rounded hover:bg-gray-50"
            >
              <FiEdit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded ${isEditing
                    ? "border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed"
                  }`}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                readOnly
                className="w-full px-3 py-2 text-sm sm:text-base text-gray-900 border border-gray-200 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                readOnly={!isEditing}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded ${isEditing
                    ? "border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed"
                  }`}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                readOnly={!isEditing}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded ${isEditing
                    ? "border-gray-300 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed"
                  }`}
              />
            </div>
          </div>
        </div>

        {/* Save / Cancel Buttons */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-8">
            <button
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className={`w-full sm:w-auto px-6 py-2.5 text-white rounded text-sm sm:text-base font-medium transition-colors ${isUpdating
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUpdating}
              className={`w-full sm:w-auto px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded text-sm sm:text-base font-medium hover:bg-gray-50 ${isUpdating ? "cursor-not-allowed" : ""
                }`}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
