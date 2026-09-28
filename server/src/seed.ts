import { connectDB, disconnectDB } from './db.js';
import { Problem } from './models/index.js';

const SEED_PROBLEMS = [
  {
    problemId: 'parking-lot',
    title: 'Parking Lot',
    difficulty: 'Medium' as const,
    concepts: ['Strategy', 'Composition', 'Encapsulation'],
    description:
      'Design a parking lot system that supports multiple floors and different types of parking spots. The system should efficiently assign vehicles to appropriate spots and handle entry/exit with fee calculation.',
    requirements: [
      'Support multiple floors, each with configurable parking spots',
      'Handle different vehicle types: Bike, Car, Truck',
      'Each vehicle type requires a specific spot size (Small, Medium, Large)',
      'Assign the nearest suitable spot to an incoming vehicle',
      'Track vehicle entry and exit timestamps',
      'Calculate parking fee based on duration and vehicle type',
      'Display availability per floor and spot type',
      'System must be extensible for new vehicle types without modifying core logic',
    ],
    expectedFormat: [
      'Classes (e.g., ParkingLot, Floor, ParkingSpot, Vehicle, Ticket)',
      'Interfaces (e.g., PricingStrategy, SpotAssignmentStrategy)',
      'Relationships (inheritance, composition, association)',
      'Important methods (parkVehicle, unparkVehicle, calculateFee)',
      'Design explanation (why you chose these abstractions)',
    ],
  },
  {
    problemId: 'vending-machine',
    title: 'Vending Machine',
    difficulty: 'Easy' as const,
    concepts: ['State', 'Encapsulation'],
    description:
      'Design a vending machine that accepts money, lets the user select a product, validates the transaction, dispenses the product, and returns change. Handle edge cases like insufficient money and out-of-stock items.',
    requirements: [
      'Insert money in various denominations',
      'Select a product from available inventory',
      'Check product availability before dispensing',
      'Dispense the selected product on successful payment',
      'Return correct change after purchase',
      'Handle insufficient money scenario gracefully',
      'Handle out-of-stock scenario gracefully',
      'Track inventory and allow restocking',
    ],
    expectedFormat: [
      'Classes (e.g., VendingMachine, Product, Inventory, Coin)',
      'Interfaces (e.g., State, PaymentProcessor)',
      'Relationships (state transitions, composition)',
      'Important methods (insertMoney, selectProduct, dispense, returnChange)',
      'Design explanation (why you chose these abstractions)',
    ],
  },
  {
    problemId: 'elevator-system',
    title: 'Elevator System',
    difficulty: 'Medium' as const,
    concepts: ['State', 'Strategy'],
    description:
      'Design an elevator system for a building with multiple floors. The system manages multiple elevators, handles floor requests, and uses a configurable scheduling strategy to dispatch the optimal elevator.',
    requirements: [
      'Support a configurable number of floors',
      'Handle external requests (up/down button on a floor)',
      'Handle internal requests (floor button inside elevator)',
      'Move elevators up and down between floors',
      'Open and close doors at each stop',
      'Support multiple elevators operating concurrently',
      'Implement an elevator selection/dispatch strategy',
      'System must be extensible for new scheduling algorithms',
    ],
    expectedFormat: [
      'Classes (e.g., Building, Elevator, Floor, Request, Dispatcher)',
      'Interfaces (e.g., SchedulingStrategy, DoorController)',
      'Relationships (association, strategy pattern)',
      'Important methods (requestElevator, moveToFloor, openDoor, closeDoor)',
      'Design explanation (why you chose these abstractions)',
    ],
  },
];

async function seed() {
  await connectDB();

  console.log('Clearing existing problems...');
  await Problem.deleteMany({});

  console.log('Seeding 3 problems...');
  await Problem.insertMany(SEED_PROBLEMS);

  console.log('✓ Seed complete');
  await disconnectDB();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
