import React from 'react';

const CustomerCard = ({ customer }) => {
  return (
    <div className="customer-card">
      <h3>{customer.first_name} {customer.last_name}</h3>
      <p><strong>Email:</strong> {customer.email}</p>
      <p className="order-count">
        <strong>Orders:</strong> {customer.orderCount || 0}
      </p>
      {customer.city && customer.country && (
        <p><strong>Location:</strong> {customer.city}, {customer.country}</p>
      )}
    </div>
  );
};

export default CustomerCard;