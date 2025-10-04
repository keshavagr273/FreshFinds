const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freshmart');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create sample customers
    const customers = [
      {
        username: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        phone: '1234567890',
        role: 'customer',
        customerID: 'CUST12345678ABCD',
        isVerified: true,
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        username: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        phone: '0987654321',
        role: 'customer',
        customerID: 'CUST87654321EFGH',
        isVerified: true,
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001',
          country: 'USA'
        }
      }
    ];

    const createdCustomers = await User.insertMany(customers);
    console.log('Created sample customers');

    // Create sample merchants
    const merchants = [
      {
        username: 'FreshMart Store',
        email: 'merchant1@freshmart.com',
        password: await bcrypt.hash('merchant123', 12),
        phone: '5551234567',
        role: 'merchant',
        merchantID: 'MERCH12345678WXYZ',
        storeName: 'FreshMart Organic Store',
        storeDescription: 'Premium organic fruits and vegetables sourced directly from local farms.',
        isVerified: true,
        address: {
          street: '789 Business Blvd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        }
      },
      {
        username: 'Green Valley Farm',
        email: 'merchant2@freshmart.com',
        password: await bcrypt.hash('merchant123', 12),
        phone: '5559876543',
        role: 'merchant',
        merchantID: 'MERCH87654321PQRS',
        storeName: 'Green Valley Farm Market',
        storeDescription: 'Fresh produce straight from our sustainable farm to your table.',
        isVerified: true,
        address: {
          street: '321 Farm Road',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA'
        }
      }
    ];

    const createdMerchants = await User.insertMany(merchants);
    console.log('Created sample merchants');

    // Create sample products
    const products = [
      {
        name: 'Fresh Organic Bananas',
        description: 'Premium organic bananas sourced from sustainable farms. Rich in potassium and perfect for smoothies or snacking.',
        price: 2.49,
        originalPrice: 3.49,
        discount: 29,
        category: 'fruits',
        images: [
          {
            url: '/images/banana.jpg',
            alt: 'Fresh Organic Bananas'
          }
        ],
        merchant: createdMerchants[0]._id,
        freshness: {
          score: 88,
          analyzedAt: new Date(),
          expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          storageInstructions: 'Store at room temperature, away from direct sunlight'
        },
        stock: {
          quantity: 50,
          unit: 'kg',
          minStock: 10
        },
        nutrition: {
          calories: 89,
          protein: '1.1g',
          carbs: '23g',
          fat: '0.3g',
          fiber: '2.6g'
        },
        tags: ['organic', 'fresh', 'potassium', 'healthy'],
        organic: true,
        locallySourced: true,
        rating: {
          average: 4.6,
          count: 45
        }
      },
      {
        name: 'Fresh Tomatoes',
        description: 'Vine-ripened tomatoes with exceptional flavor. Perfect for salads, sauces, and cooking.',
        price: 3.99,
        originalPrice: 5.99,
        discount: 33,
        category: 'vegetables',
        images: [
          {
            url: '/images/tomato.jpg',
            alt: 'Fresh Tomatoes'
          }
        ],
        merchant: createdMerchants[0]._id,
        freshness: {
          score: 92,
          analyzedAt: new Date(),
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          storageInstructions: 'Store at room temperature until ripe, then refrigerate'
        },
        stock: {
          quantity: 30,
          unit: 'kg',
          minStock: 5
        },
        nutrition: {
          calories: 18,
          protein: '0.9g',
          carbs: '3.9g',
          fat: '0.2g',
          fiber: '1.2g'
        },
        tags: ['fresh', 'vine-ripened', 'lycopene', 'vitamin-c'],
        locallySourced: true,
        rating: {
          average: 4.7,
          count: 67
        }
      },
      {
        name: 'Artisan Bread',
        description: 'Freshly baked artisan bread made with premium flour and traditional baking methods.',
        price: 2.99,
        originalPrice: 3.99,
        discount: 25,
        category: 'bakery',
        images: [
          {
            url: '/images/bread.jpg',
            alt: 'Artisan Bread'
          }
        ],
        merchant: createdMerchants[1]._id,
        freshness: {
          score: 90,
          analyzedAt: new Date(),
          expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          storageInstructions: 'Store in a cool, dry place. Freeze for longer storage.'
        },
        stock: {
          quantity: 25,
          unit: 'piece',
          minStock: 5
        },
        nutrition: {
          calories: 280,
          protein: '8g',
          carbs: '54g',
          fat: '2g',
          fiber: '4g'
        },
        ingredients: ['Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar', 'Olive Oil'],
        tags: ['artisan', 'fresh-baked', 'traditional'],
        rating: {
          average: 4.8,
          count: 23
        }
      },
      {
        name: 'Fresh Farm Eggs',
        description: 'Free-range eggs from happy hens. Rich in protein and perfect for any meal.',
        price: 4.49,
        originalPrice: 5.99,
        discount: 25,
        category: 'dairy',
        images: [
          {
            url: '/images/egg.jpg',
            alt: 'Fresh Farm Eggs'
          }
        ],
        merchant: createdMerchants[1]._id,
        freshness: {
          score: 95,
          analyzedAt: new Date(),
          expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          storageInstructions: 'Refrigerate at 40°F or below'
        },
        stock: {
          quantity: 40,
          unit: 'dozen',
          minStock: 8
        },
        nutrition: {
          calories: 70,
          protein: '6g',
          carbs: '0g',
          fat: '5g',
          fiber: '0g'
        },
        tags: ['free-range', 'protein', 'omega-3'],
        organic: true,
        locallySourced: true,
        rating: {
          average: 4.8,
          count: 34
        }
      },
      {
        name: 'Fresh Atlantic Fish',
        description: 'Wild-caught Atlantic fish, sustainably sourced. High in omega-3 fatty acids.',
        price: 12.99,
        originalPrice: 16.99,
        discount: 24,
        category: 'protein',
        images: [
          {
            url: '/images/fish.jpg',
            alt: 'Fresh Atlantic Fish'
          }
        ],
        merchant: createdMerchants[0]._id,
        freshness: {
          score: 94,
          analyzedAt: new Date(),
          expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          storageInstructions: 'Keep refrigerated at 32-38°F. Use within 1-2 days.'
        },
        stock: {
          quantity: 15,
          unit: 'kg',
          minStock: 3
        },
        nutrition: {
          calories: 206,
          protein: '22g',
          carbs: '0g',
          fat: '12g',
          fiber: '0g'
        },
        tags: ['wild-caught', 'omega-3', 'sustainable', 'protein'],
        rating: {
          average: 4.9,
          count: 12
        }
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log('Created sample products');

    console.log('\n=== SEED DATA SUMMARY ===');
    console.log(`Created ${createdCustomers.length} customers`);
    console.log(`Created ${createdMerchants.length} merchants`);
    console.log(`Created ${createdProducts.length} products`);
    
    console.log('\n=== SAMPLE LOGIN CREDENTIALS ===');
    console.log('Customers:');
    console.log('- Email: john@example.com, Password: password123');
    console.log('- Email: jane@example.com, Password: password123');
    console.log('\nMerchants:');
    console.log('- Email: merchant1@freshmart.com, Password: merchant123');
    console.log('- Email: merchant2@freshmart.com, Password: merchant123');

    process.exit(0);
  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;