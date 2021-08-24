import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import MeetUpLista from '../components/meetups/MeetupList';
import { MongoClient } from 'mongodb';

const HomePage = (props) => {
	// const [loadedMeetUps, setLoadedMeetup] = useState([]);

	// useEffect(() => {
	// 	setLoadedMeetup(DUMMY_MEETUPS);
	// }, []);
	return (
		<Fragment>
			<Head>
				<title>React MeetUps Page</title>
				<meta name='description' content='Highly active React MeetUps' />
			</Head>
			<MeetUpLista meetups={props.meetups} />
		</Fragment>
	);
};

// export async function getServerSideProps(context) {
// 	//Better for multiple changes on the server very frequently like on every second
// 	//Authentication and Cookies data ????
// 	const req = context.req;
// 	const res = context.res;

// 	return {
// 		props: {
// 			meetups: DUMMY_MEETUPS,
// 		},
// 	};
// }

export async function getStaticProps() {
	const client = await MongoClient.connect(
		'mongodb+srv://nikola:s09spowpqJa4uept@cluster0.xvpz9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
	);

	const db = client.db();

	const meetupsCollection = db.collection('meetups');
	const meetups = await meetupsCollection.find().toArray();
	client.close();

	return {
		props: {
			meetups: meetups.map((meetup) => ({
				title: meetup.title,
				address: meetup.address,
				image: meetup.image,
				description: meetup.description,
				id: meetup._id.toString(),
			})),
		},
		revalidate: 1,
	};
}

export default HomePage;
