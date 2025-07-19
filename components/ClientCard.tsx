
import React from 'react';
import { Link } from 'react-router-dom';
import type { Client } from '../types';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Link 
      to={`/client/${client.id}`}
      className="group block bg-slate-800 rounded-xl shadow-lg hover:shadow-blue-500/20 focus:shadow-blue-500/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75"
    >
      <div className="overflow-hidden rounded-t-xl">
        <img
          src={client.imageUrl}
          alt={client.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          aria-label={client.name}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-100 text-center">{client.name}</h3>
      </div>
    </Link>
  );
};

export default ClientCard;