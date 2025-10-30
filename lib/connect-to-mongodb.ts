import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

const cached: { conn: any; promise: any } = (global as any).mongoose || {
	conn: null,
	promise: null,
};

if (!(global as any).mongoose) {
	(global as any).mongoose = cached;
}

async function connectToMongoDb() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			
			bufferCommands: false,
			
			serverSelectionTimeoutMS: 5000, 
			socketTimeoutMS: 45000, 
			connectTimeoutMS: 10000, 
			
			maxPoolSize: 10, 
			minPoolSize: 5, 
			maxIdleTimeMS: 30000, 
			
			retryWrites: true, 
			retryReads: true, 
			
			
			heartbeatFrequencyMS: 10000, 
			
			...(process.env.NODE_ENV === 'production' && {
				ssl: true,
				sslValidate: true,
				authSource: 'admin',
			}),
			
			
			appName: 'payveda-app',
		};
		
		cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
			return mongoose;
		});
	}

	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}

	return cached.conn;
}

export default connectToMongoDb;
