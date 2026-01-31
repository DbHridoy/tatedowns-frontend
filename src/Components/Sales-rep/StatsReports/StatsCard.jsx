
const Card = ({ title, value, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-lg rounded-lg text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const StatsCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <Card
        title="Total Leads"
        value="500"
        icon={<i className="fas fa-users"></i>} // You can replace this with any icon from FontAwesome or another library
      />
      <Card
        title="Total Quotes"
        value="450"
        icon={<i className="fas fa-file-invoice-dollar"></i>}
      />
      <Card
        title="Jobs Booked"
        value="300"
        icon={<i className="fas fa-briefcase"></i>}
      />
      <Card
        title="Jobs Closed"
        value="250"
        icon={<i className="fas fa-flag-checkered"></i>}
      />
      <Card
        title="Total Sales"
        value="$150k"
        icon={<i className="fas fa-dollar-sign"></i>}
      />
    </div>
  );
};

export default StatsCard;
