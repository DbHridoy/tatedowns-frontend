import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import JobsList from "../../Common/Jobs/JobsList";

const Jobs = () => {
  const user = useSelector(selectCurrentUser);
  return <JobsList showFilters salesRepId={user?._id} />;
};

export default Jobs;
