const db = require('./database');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const importCSV = (file, table, transformFn) => {
  return new Promise((resolve) => {
    const rows = [];
    fs.createReadStream(path.join(__dirname, '../data', file))
      .pipe(csv())
      .on('data', (row) => rows.push(transformFn(row)))
      .on('end', () => {
        db.serialize(() => {
          const placeholders = rows[0].map(() => '?').join(',');
          const stmt = db.prepare(`INSERT OR IGNORE INTO ${table} VALUES (${placeholders})`);
          
          rows.forEach(row => stmt.run(row));
          stmt.finalize();
          
          console.log(`Imported ${rows.length} ${table} records`);
          resolve();
        });
      });
  });
};

// Import in correct order
Promise.all([
  importCSV('users.csv', 'users', row => [
    row.id, row.first_name, row.last_name, row.email, row.age, row.gender,
    row.state, row.street_address, row.postal_code, row.city, row.country,
    row.latitude, row.longitude, row.traffic_source, row.created_at
  ]),
  importCSV('products.csv', 'products', row => [
    row.id, row.cost, row.category, row.name, row.brand, 
    row.retail_price, row.department, row.sku, row.distribution_center_id
  ]),
  importCSV('orders.csv', 'orders', row => [
    row.order_id, row.user_id, row.status, row.gender, row.created_at,
    row.returned_at || null, row.shipped_at || null, 
    row.delivered_at || null, row.num_of_item
  ]),
  importCSV('order_items.csv', 'order_items', row => [
    row.id, row.order_id, row.user_id, row.product_id, row.inventory_item_id,
    row.status, row.created_at, row.shipped_at, row.delivered_at, row.returned_at
  ])
]).then(() => {
  console.log('All data imported successfully!');
  process.exit();
});