import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import ClientsList from "../../Common/Clients/ClientsList";

const SalesRepClients = () => {
  const user = useSelector(selectCurrentUser);
  return <ClientsList salesRepId={user?._id} />;
};

export default SalesRepClients;
