import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";

const quotesData = [
  { id: 'Q1234', client: 'John Doe', price: '$1,500.00', date: '2025-11-20', status: 'Open' },
  { id: 'Q1235', client: 'Jane Smith', price: '$2,000.00', date: '2025-11-18', status: 'Accepted' },
  { id: 'Q1236', client: 'Mark Johnson', price: '$850.00', date: '2025-11-17', status: 'Open' },
  { id: 'Q1237', client: 'Mark Johnson', price: '$1,200.00', date: '2025-11-16', status: 'Accepted' },
  { id: 'Q1238', client: 'Sara Williams', price: '$1,750.00', date: '2025-11-15', status: 'Closed' },
  { id: 'Q1239', client: 'Robert Brown', price: '$3,200.00', date: '2025-11-14', status: 'Open' },
  { id: 'Q1240', client: 'Lisa Taylor', price: '$950.00', date: '2025-11-13', status: 'Accepted' },
  { id: 'Q1241', client: 'Michael Wilson', price: '$2,500.00', date: '2025-11-12', status: 'Closed' },
];

const QuoteTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const totalPages = Math.ceil(quotesData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, quotesData.length);
  const currentQuotes = quotesData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mobile Card View Component
  const QuoteCard = ({ quote }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{quote.id}</h3>
          <p className="text-sm text-gray-500">Quote ID</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
          {quote.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-700 font-medium">{quote.client[0]}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{quote.client}</p>
            <p className="text-sm text-gray-500">Client</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-bold text-gray-800">{quote.price}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-800">{quote.date}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <button
          onClick={() => navigate(`/s/sales-rep/quote-details`)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <FiEye className="w-4 h-4" />
          <span>View Details</span>
        </button>
        <div className="flex space-x-2">
          <button className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors">
            <FiEdit2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      {/* <div className="bg-blue-100 px-4 sm:px-6 py-4 border-b border-blue-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Quotes Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and track all your quotes</p>
          </div>
          <div className="mt-3 sm:mt-0">
            <button className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <FiEdit2 className="w-5 h-5" />
              <span>Create New Quote</span>
            </button>
          </div>
        </div> */}

        {/* Stats Overview */}
        {/* <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-500">Total Quotes</p>
            <p className="text-xl font-bold text-gray-800">{quotesData.length}</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-500">Open</p>
            <p className="text-xl font-bold text-blue-600">
              {quotesData.filter(q => q.status === 'Open').length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-xl font-bold text-green-600">
              {quotesData.filter(q => q.status === 'Accepted').length}
            </p>
          </div>
        </div> */}
      {/* </div> */}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Quote ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Estimated Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Quote Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentQuotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                      <span className="font-medium text-blue-600">Q</span>
                    </div>
                    <span className="font-medium text-gray-900">{quote.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-gray-700 font-medium">{quote.client[0]}</span>
                    </div>
                    <span className="text-gray-700">{quote.client}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold text-gray-900">{quote.price}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-700">{quote.date}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/s/sales-rep/quote-details`)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors">
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden p-4">
        {currentQuotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{startIndex + 1}</span> -{' '}
            <span className="font-semibold">{endIndex}</span> of{' '}
            <span className="font-semibold">{quotesData.length}</span> quotes
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Previous page"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">←</span>
            </button>

            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                if (totalPages <= 3 || pageNum === 1 || pageNum === totalPages || pageNum === currentPage) {
                  return (
                    <button
                      key={index}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 1 || pageNum === currentPage + 1) {
                  return <span key={index} className="px-2 text-gray-500">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      {/* <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search quotes by client name or ID..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div className="flex space-x-3">
            <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="Accepted">Accepted</option>
              <option value="Closed">Closed</option>
            </select>
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2">
              <FiEdit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default QuoteTable;
