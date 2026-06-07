import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/slice/authSlice";
import QuotesList from "../../Common/Quotes/QuotesList";

const SalesRepQuotes = () => {
  const user = useSelector(selectCurrentUser);
  return <QuotesList salesRepId={user?._id} />;
};

export default SalesRepQuotes;
