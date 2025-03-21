const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose');

const prompt = require('prompt-sync')();

const Customer = require('./models/customer.js');
mongoose.connect(process.env.MONGODB_URI);

const startUp = async () => {
    await addCustomers();
    await mainMenu();
}
const addCustomers = async () => {
    const charleeAdded = await Customer.findOne({name: 'Charlee'})
    const juniperAdded = await Customer.findOne({name: 'Juniper'})
    if (!charleeAdded) {
        await Customer.create({ name: 'Charlee', age: 42 });
    }
    if (!juniperAdded) {
        await Customer.create({ name: 'Juniper', age: 30 });
    }
}

const mainMenu = async () => {
    console.log(`Welcome to the CRM`);
    console.log('What would you like to do?');
    console.log('  1. Create a customer');
    console.log('  2. View all customers');
    console.log('  3. Update a customer');
    console.log('  4. Delete a customer');
    console.log('  5. Leave CRM');
    const choice = prompt('What number do you choose?');

    if (choice === '1') {
       await createCustomer();
    } else if (choice === '2') {
        await viewCustomers();
    } else if (choice === '3') {
        await updateCustomer();
    } else if (choice === '4') {
        await deleteCustomer();
    } else if (choice === '5') {
        await mongoose.connection.close();
        console.log('-----Connection Closed!-----')
    } else {
        console.log('Please Enter a number 1-5');
        mainMenu()
    }      
}

const createCustomer = async () => {
    console.log('-----Lets create a customer!-----')
    let name = prompt('What is the customer Name?');
    let age = prompt('How old is the customer?');
    const newCustomer =  {
        name: name,
        age: Number(age),
    }
    await Customer.create(newCustomer);
    console.log('-----Customer added!-----')
    mainMenu();
}
const viewCustomers = async () => {
    const customer = await Customer.find();
    customer.forEach((customer, index) => {
        console.log(`  [${index + 1}] NAME: ${customer.name}, AGE: ${customer.age}`)
    })
    await mainMenu()
}
const updateCustomer = async () => {
    console.log(`-----Lets update a customer's Infomation!-----`)
    const customers = await Customer.find();
    customers.forEach((customer, index) => {
        console.log(`  ${index + 1}. NAME: ${customer.name}, AGE: ${customer.age}`)
    })
    const customerUpdate = prompt('Which customer did you want to update?');
    const selectedIndex = Number(customerUpdate) - 1;
    const customerToUpdate = customers[selectedIndex];
    const newName = prompt(`Enter new Name for ${customerToUpdate.name} or press enter to keep.`) || customerToUpdate.name;
    const newAge = prompt(`Enter new age for ${newName}, or press enter to keep`) || customerToUpdate.age;
    customerToUpdate.name = newName;
    customerToUpdate.age = Number(newAge);
    await Customer.create(customerToUpdate);
    console.log('-----Customer updated!-----')
    const customer = await Customer.find();
    customer.forEach((customer, index) => {
        console.log(`  [${index + 1}] NAME: ${customer.name}, AGE: ${customer.age}`)
    })
    await mainMenu()
}
const deleteCustomer = async () => {
    console.log('-----Lets delete a customer!-----');
    const customer = await Customer.find();
    customer.forEach((customer, index) => {
        console.log(`  [${index + 1}] NAME: ${customer.name}, AGE: ${customer.age}`)
    })
    const userDeleteIndex = prompt('Which customer did you want to delete?')
    const selectedIndex = Number(userDeleteIndex) -1;
    const customerToDelete = customer[selectedIndex];
    await Customer.findByIdAndDelete(customerToDelete._id);
    console.log('-----Customer Deleted!-----')
    await mainMenu()
}
startUp()