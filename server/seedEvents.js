require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');

const ADMIN_EMAIL = 'paraitime@gmail.com'; // change if your admin uses a different email

const events = [
    {
        title: 'Indie Music Night',
        description: 'An evening of live indie performances from up-and-coming artists.',
        date: new Date('2026-08-02'),
        location: 'Phoenix Marketcity, Bangalore',
        category: 'Music',
        totalSeats: 100,
        ticketPrice: 499,
        image: 'https://loremflickr.com/640/360/concert,music',
    },
    {
        title: 'Startup Pitch Night',
        description: 'Watch 10 early-stage startups pitch to a panel of investors.',
        date: new Date('2026-08-10'),
        location: 'WeWork Galaxy, Bangalore',
        category: 'Business',
        totalSeats: 60,
        ticketPrice: 0,
        image: 'https://loremflickr.com/640/360/startup,office',
    },
    {
        title: 'Modern Art Exhibition',
        description: 'A curated showcase of contemporary South Asian artists.',
        date: new Date('2026-08-15'),
        location: 'National Gallery of Modern Art, Bangalore',
        category: 'Art',
        totalSeats: 150,
        ticketPrice: 199,
        image: 'https://loremflickr.com/640/360/artgallery,painting',
    },
    {
        title: 'Marathon for a Cause',
        description: '10K charity run supporting local education initiatives.',
        date: new Date('2026-08-22'),
        location: 'Cubbon Park, Bangalore',
        category: 'Sports',
        totalSeats: 300,
        ticketPrice: 299,
        image: 'https://loremflickr.com/640/360/marathon,running',
    },
    {
        title: 'Stand-up Comedy Open Mic',
        description: 'New and seasoned comedians take the stage for one wild night.',
        date: new Date('2026-08-28'),
        location: 'The Humming Tree, Bangalore',
        category: 'Comedy',
        totalSeats: 80,
        ticketPrice: 250,
        image: 'https://loremflickr.com/640/360/comedy,microphone',
    },
];

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');

        const admin = await User.findOne({ email: ADMIN_EMAIL });
        if (!admin) {
            console.log(`No user found with email ${ADMIN_EMAIL}. Update ADMIN_EMAIL at the top of this script.`);
            process.exit(1);
        }

        const eventsToInsert = events.map(e => ({
            ...e,
            availableSeats: e.totalSeats,
            createdBy: admin._id,
        }));

        await Event.insertMany(eventsToInsert);
        console.log(`Inserted ${eventsToInsert.length} events.`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

run();