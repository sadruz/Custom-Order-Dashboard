const db = require('./database.js');
const fs = require('fs');
const csv = require('csv-parser');

// Helper function to process CSV
const importCSV = (filePath, tableName, columns, transformFn) => {
  return new Promise((resolve) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(transformFn(row)))
      .on('end', async () => {
        // Insert all rows in a transaction
        db.serialize(() => {
          db.run('BEGIN TRANSACTION');
          rows.forEach((row) => {
            db.run(`INSERT OR IGNORE INTO ${tableName} VALUES (${columns.map(() => '?').join(',')})`, row);
          });
          db.run('COMMIT');
        });
        console.log(`Finished importing ${tableName}`);
        resolve();
      });
  });
};

// Import data in correct order
(async () => {
  // 1. Users
  await importCSV('./data/users.csv', 'users', 
    ['id', 'first_name', 'last_name', 'email', 'age', 'gender', 
     'state', 'street_address', 'postal_code', 'city', 'country',
     'latitude', 'longitude', 'traffic_source', 'created_at'],
    (row) => Object.values(row)
  );

  // 2. Orders (Milestone 1 requirement)
  await importCSV('./data/orders.csv', 'orders',
    ['order_id', 'user_id', 'status', 'gender', 'created_at',
     'returned_at', 'shipped_at', 'delivered_at', 'num_of_item'],
    (row) => [
      row.order_id, row.user_id, row.status, row.gender, row.created_at,
      row.returned_at || null, row.shipped_at || null, 
      row.delivered_at || null, row.num_of_item
    ]
  );

  console.log('All data imported successfully!');
  process.exit(0); // Explicitly exit the script
})();