import { useGetMeQuery } from "../redux/api/userApi";

const SalesRepTopbar = () => {
  const { data: profileData } = useGetMeQuery();
  //console.log("Profile data from topbar", profileData);
  const profile = profileData?.data;
  //console.log("Profile data:", profile);
  return (
    <div className="flex justify-between items-center w-full">
      {/* Page Title */}
      <div className="flex-1 flex justify-center items-center">
        {/* <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:border-blue-500"
        /> */}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-5">
        {/* User avatar + info */}
        <div className="flex items-center gap-3 cursor-pointer">
          <img
            src={profile?.profileImage}
            alt={profile?.fullName || "User"}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
          />

          <div className="hidden md:block text-right leading-tight">
            <p className="font-medium">{profile?.fullName || "Username"}</p>
            <p className="text-sm text-gray-500">
              {profile?.role || "User Role"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRepTopbar;
