function SalesRepHomeCards({ cards }) {



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl flex flex-col items-center px-5 py-6 space-y-3"
        >
          <div className="bg-blue-100 p-2.5 flex items-center justify-center rounded-full">
            {card.icon}
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">{card.title}</p>
            <p className="text-xl sm:text-2xl font-semibold text-gray-800">
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SalesRepHomeCards;
